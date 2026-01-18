import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { PrismaService } from '../prisma/service/prisma.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
  ],
  controllers: [ProductController],
  providers: [ProductService,PrismaService,AuthGuard,RolesGuard],
  exports: [ProductService],
})
export class ProductModule {}
