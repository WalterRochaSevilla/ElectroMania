import { parse } from "path";

// Helper to parse dynamic buckets from environment
// Format: R2_BUCKET_<NAME>=bucket_name (e.g., R2_BUCKET_CAROUSEL=my-carousel-bucket)
const parseDynamicBuckets = (): Record<string, string> => {
    const buckets: Record<string, string> = {};
    Object.keys(process.env).forEach(key => {
        if (key.startsWith('R2_BUCKET_')) {
            const bucketKey = key.replace('R2_BUCKET_', '').toLowerCase();
            buckets[bucketKey] = process.env[key] || '';
        }
    });
    return buckets;
};

export default () => ({
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        type: process.env.DATABASE_TYPE,
        name: process.env.DATABASE_NAME,
        syncronize: process.env.DATABASE_STYNCHRONIZE
    },
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10')
    },
    jwtConstants: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION
    },
    webSiteDomain: {
        url: process.env.WEBSITE_DOMAIN
    },
    apiDomain: {
        url: process.env.API_DOMAIN
    },
    cloudflareR2: {
        accountId: process.env.ACCOUNT_ID,
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        publicEndpoint: process.env.R2_PUBLIC_ENDPOINT,
        // Default buckets (always available)
        publicBucket: process.env.R2_PUBLIC_BUCKET_NAME || 'assets',
        privateBucket: process.env.R2_PRIVATE_BUCKET_NAME || 'receipts',
        // Dynamic buckets - add R2_BUCKET_<NAME>=bucket_name to .env
        // Example: R2_BUCKET_CAROUSEL=my-carousel-bucket
        dynamicBuckets: parseDynamicBuckets(),
    }
})
