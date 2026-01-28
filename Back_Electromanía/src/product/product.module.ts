import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { PrismaService } from '../prisma/service/prisma.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CloudinaryImageStorage } from '../common/utils/storage/cloudinary-image.storage';
import { LocalImageStorage } from '../common/utils/storage/local-image.storage';
import { RegisterProductUseCase } from './use-cases/register-product.use-case';
import config from '../config/Configuration';
import { ProductMapper } from './mapper/Product.mapper';
import { R2ImageStorage } from '../common/utils/storage/r2-image-storage.storage';
import { ProductImageMapper } from './mapper/ProductImage.mapper';
import { PageProductMapper } from './mapper/PageProduct.mapper';

@Module({
  imports: [
  ],
  controllers: [ProductController],
  providers: [ProductService,PrismaService,AuthGuard,RolesGuard,ProductMapper,ProductImageMapper,PageProductMapper,
    {
      provide: 'ImageStorage',
      useClass: config().storage.driver === 'cloudinary' ? CloudinaryImageStorage : config().storage.driver === 'r2' ?
      R2ImageStorage : LocalImageStorage,
    },RegisterProductUseCase
  ],
  exports: [ProductService],
})
export class ProductModule {}
