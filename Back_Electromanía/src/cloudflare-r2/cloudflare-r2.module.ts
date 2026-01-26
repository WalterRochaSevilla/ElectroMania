import { Global, Module } from '@nestjs/common';
import { CloudflareR2Service } from './cloudflare-r2.service';
import { CloudflareR2Controller } from './cloudflare-r2.controller';
import { PrismaService } from '../prisma/service/prisma.service';

@Global()
@Module({
    controllers: [CloudflareR2Controller],
    providers: [CloudflareR2Service, PrismaService],
    exports: [CloudflareR2Service],
})
export class CloudflareR2Module { }
