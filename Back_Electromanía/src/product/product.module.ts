import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { PrismaService } from 'src/prisma/service/prisma.service';

@Module({
  imports: [
  ],
  controllers: [ProductController],
  providers: [ProductService,PrismaService],
  exports: [ProductService],
})
export class ProductModule {}
