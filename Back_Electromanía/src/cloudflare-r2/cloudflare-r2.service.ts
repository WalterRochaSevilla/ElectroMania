import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/service/prisma.service';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as sharp from 'sharp';

export type BucketType = 'assets' | 'receipts';

export interface ImageProcessingOptions {
    maxWidth?: number;
    quality?: number;
}

export interface UploadResult {
    key: string;
    url: string;
    size: number;
    mimeType: string;
}

@Injectable()
export class CloudflareR2Service implements OnModuleInit {
    private readonly logger = new Logger(CloudflareR2Service.name);
    private s3Client: S3Client;
    private accountId: string;
    private publicEndpoint: string;
    private buckets: Record<string, string> = {};
    private dynamicBuckets: Record<string, string> = {};

    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) { }

    onModuleInit() {
        const r2Config = this.configService.get('cloudflareR2');

        this.accountId = r2Config.accountId;
        this.publicEndpoint = r2Config.publicEndpoint;

        // Default buckets
        this.buckets = {
            assets: r2Config.publicBucket,
            receipts: r2Config.privateBucket,
        };

        // Dynamic buckets from R2_BUCKET_<NAME>=bucket_name env vars
        this.dynamicBuckets = r2Config.dynamicBuckets || {};

        // Merge all buckets
        Object.assign(this.buckets, this.dynamicBuckets);

        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: r2Config.accessKeyId,
                secretAccessKey: r2Config.secretAccessKey,
            },
        });

        this.logger.log(`Cloudflare R2 client initialized with buckets: ${Object.keys(this.buckets).join(', ')}`);
    }

    /**
     * Get all available bucket names
     */
    getAllBuckets(): string[] {
        return Object.keys(this.buckets);
    }

    /**
     * Check if a bucket exists by name
     */
    hasBucket(name: string): boolean {
        return name in this.buckets;
    }

    /**
     * Process image: resize to max width and convert to WebP
     */
    async processImage(
        buffer: Buffer,
        options: ImageProcessingOptions = {},
    ): Promise<Buffer> {
        const { maxWidth = 3840, quality = 100 } = options;

        return sharp(buffer)
            .resize(maxWidth, null, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({ quality })
            .toBuffer();
    }

    /**
     * Upload file to public assets bucket
     */
    async uploadPublic(
        buffer: Buffer,
        key: string,
        mimeType: string,
    ): Promise<UploadResult> {
        return this.upload(buffer, key, mimeType, 'assets');
    }

    /**
     * Upload file to private receipts bucket
     */
    async uploadPrivate(
        buffer: Buffer,
        key: string,
        mimeType: string,
    ): Promise<UploadResult> {
        return this.upload(buffer, key, mimeType, 'receipts');
    }

    /**
     * Upload file to specified bucket (supports dynamic buckets)
     * @param bucket Bucket name - 'assets', 'receipts', or any dynamic bucket from R2_BUCKET_<NAME>
     */
    async upload(
        buffer: Buffer,
        key: string,
        mimeType: string,
        bucket: string,
    ): Promise<UploadResult> {
        const bucketName = this.buckets[bucket];

        if (!bucketName) {
            throw new Error(`Unknown bucket: ${bucket}. Available: ${this.getAllBuckets().join(', ')}`);
        }

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        });

        await this.s3Client.send(command);

        // Track in database to minimize Class A operations
        await this.prisma.cloudflareUsage.upsert({
            where: { key },
            create: {
                key,
                size: buffer.length,
                mimeType,
            },
            update: {
                size: buffer.length,
                mimeType,
            },
        });

        // Generate URL based on bucket type
        const url = bucket === 'assets'
            ? `${this.publicEndpoint}/${key}`
            : await this.getPresignedUrl(key, bucket);

        this.logger.log(`Uploaded ${key} to ${bucketName} (${buffer.length} bytes)`);

        return {
            key,
            url,
            size: buffer.length,
            mimeType,
        };
    }

    /**
     * Generate presigned URL for private files
     * @param key File key in bucket
     * @param bucket Bucket type (default: receipts)
     * @param expiresIn Expiration time in seconds (default: 3600 = 1 hour)
     */
    async getPresignedUrl(
        key: string,
        bucket: string = 'receipts',
        expiresIn: number = 3600,
    ): Promise<string> {
        const bucketName = this.buckets[bucket];

        if (!bucketName) {
            throw new Error(`Unknown bucket: ${bucket}`);
        }

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        return getSignedUrl(this.s3Client, command, { expiresIn });
    }

    /**
     * Delete file from R2 and database
     */
    async delete(key: string, bucket: string): Promise<void> {
        const bucketName = this.buckets[bucket];

        if (!bucketName) {
            throw new Error(`Unknown bucket: ${bucket}`);
        }

        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await this.s3Client.send(command);

        // Remove from database tracking
        await this.prisma.cloudflareUsage.deleteMany({
            where: { key },
        });

        this.logger.log(`Deleted ${key} from ${bucketName}`);
    }

    /**
     * Check if file exists in bucket
     */
    async exists(key: string, bucket: BucketType): Promise<boolean> {
        const bucketName = this.buckets[bucket];

        try {
            const command = new HeadObjectCommand({
                Bucket: bucketName,
                Key: key,
            });
            await this.s3Client.send(command);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get file metadata from database (avoids Class A operation)
     */
    async getMetadata(key: string) {
        return this.prisma.cloudflareUsage.findUnique({
            where: { key },
        });
    }

    /**
     * Test connection to R2
     */
    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            // Try to check if a non-existent file exists (cheap operation)
            await this.exists('__connection_test__', 'assets');
            return {
                success: true,
                message: 'Successfully connected to Cloudflare R2',
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to connect: ${error.message}`,
            };
        }
    }

    /**
     * Get public URL for a key in assets bucket
     */
    getPublicUrl(key: string): string {
        return `${this.publicEndpoint}/${key}`;
    }
}
