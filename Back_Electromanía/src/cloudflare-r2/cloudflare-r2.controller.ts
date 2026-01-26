import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CloudflareR2Service } from './cloudflare-r2.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/UserRole.enum';

@Controller('r2')
@ApiTags('Cloudflare R2')
export class CloudflareR2Controller {
    constructor(private readonly r2Service: CloudflareR2Service) { }

    @Get('test')
    @ApiOperation({
        summary: 'Test R2 Connection',
        description: 'Tests the connection to Cloudflare R2 storage',
    })
    @ApiResponse({
        status: 200,
        description: 'Connection test result',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    })
    async testConnection() {
        return this.r2Service.testConnection();
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('test-upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: 'Test Image Upload',
        description: 'Tests uploading and processing an image to R2 (Admin only)',
    })
    @ApiResponse({
        status: 201,
        description: 'Upload successful',
        schema: {
            type: 'object',
            properties: {
                key: { type: 'string' },
                url: { type: 'string' },
                size: { type: 'number' },
                mimeType: { type: 'string' },
            },
        },
    })
    async testUpload(@UploadedFile() file: Express.Multer.File) {
        // Process image (resize + WebP conversion)
        const processedBuffer = await this.r2Service.processImage(file.buffer);

        // Generate unique key
        const timestamp = Date.now();
        const key = `test/${timestamp}.webp`;

        // Upload to public bucket
        return this.r2Service.uploadPublic(processedBuffer, key, 'image/webp');
    }
}
