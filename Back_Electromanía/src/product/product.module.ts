import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
  ],
  controllers: [ProductController],
  providers: [ProductService,PrismaService,AuthGuard,RolesGuard],
  exports: [ProductService],
})
export class ProductModule {}
