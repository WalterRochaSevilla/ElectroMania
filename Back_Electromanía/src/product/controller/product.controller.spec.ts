import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { JwtService } from '@nestjs/jwt';
import { ProductService } from '../service/product.service';
import { PrismaService } from '../../prisma/service/prisma.service';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [JwtService,ProductService,PrismaService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
