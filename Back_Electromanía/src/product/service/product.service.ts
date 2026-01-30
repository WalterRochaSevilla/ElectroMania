import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ProductMapper } from '../mapper/Product.mapper';
import { ProductImageMapper } from '../mapper/ProductImage.mapper';
import { PageProductMapper } from '../mapper/PageProduct.mapper';
import { ProductModel } from '../model/Product.model';
import { CreateProductRequestModel } from '../model/CreateProductRequest.model';
import { RegisterProductImageRequestModel } from '../model/RegisterProductImageRequest.model';
import { PageProductResponseModel } from '../model/PageProductResponse.model';
import { Prisma } from '@prisma/client';
import { join, parse} from 'path';
import * as sharp from 'sharp';
import {promises as fs } from 'fs';
import config from '../../config/Configuration'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService,
    private readonly productMapper: ProductMapper,
    private readonly productImageMapper: ProductImageMapper,
    private readonly pageProductMapper: PageProductMapper
  ) {}

  async createProduct(dto: CreateProductRequestModel, tx?: Prisma.TransactionClient): Promise<ProductModel> {
    const data = this.productMapper.toEntity(dto);
    const product = await this.prisma.product.create({
      data,
      include: {
        productImages: true,
        productCategories: { include: { category: true } }
      }
    });
    return this.productMapper.toModelWithCategoryAndImages(product);
  }

  async registerProductImage(
    dto: RegisterProductImageRequestModel,tx?: Prisma.TransactionClient
  ): Promise<ProductModel> {
    const prisma = tx? tx : this.prisma
    const product = await prisma.product.findUnique({
      where: { product_name: dto.name },
      include: { productImages: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const imageData = this.productImageMapper.toEntity(dto, product);
    await prisma.productImage.create({ data: imageData });

    const updated = await prisma.product.findUnique({
      where: { product_id: product.product_id },
      include: { productImages: true,
        productCategories: {
          include: {
            category: true
          }
        }
      },
    });
    return this.productMapper.toModelWithCategoryAndImages(updated!);
  }

  async getAllProducts(): Promise<ProductModel[]> {
    try{
      const products = await this.prisma.product.findMany({
        include: { 
          productImages: true, 
          productCategories:{
            include: {
              category: true 
            }
          }
        },
        orderBy: { product_id: 'asc' }
      });
      if(products.length === 0){
        throw new NotFoundException('Products not found');
      }
      return products.map((p) => this.productMapper.toModelWithCategoryAndImages(p));
    }catch(e){
      throw new NotFoundException('Products not found');
    }
  }

  async getPageProduct(page: number, filter?: any): Promise<PageProductResponseModel> {
    const take = 20;
    const skip = (page - 1) * take;

    const products = await this.getPageProductsByFilter(filter, skip, take);

    return this.pageProductMapper.toResponse(page, products);
  }

  private async getPageProductsByFilter(filter: any, skip?: number, take?: number): Promise<ProductModel[]> {
    const products = await this.prisma.product.findMany({
      where: filter,
      skip,
      take,
      include: { productImages: true,
        productCategories: {
          include: {
            category: true
          }
        }
       },
    });
    return products.map((p) => this.productMapper.toModelWithCategoryAndImages(p));
  }


  async getFilterBy(filter: Prisma.ProductWhereInput): Promise<ProductModel[]> {
    const products = await this.prisma.product.findMany({
      where: filter,
      include: { productImages: true,
        productCategories: {
          include: {
            category: true
          }
        }
       },
    });

    return products.map((p) => this.productMapper.toModelWithCategoryAndImages(p));
  }

  async updateProduct(
    productId: number,
    dto: Partial<CreateProductRequestModel>,
  ): Promise<ProductModel> {
    const updated = await this.prisma.product.update({
      where: { product_id: productId },
      data: this.productMapper.toUpdateEntity(dto),
      include: { productImages: true,
        productCategories: {
          include: {
            category: true
          }
        }
       },
    });
    return this.productMapper.toModelWithCategoryAndImages(updated);
  }

  async deleteProduct(productId: number): Promise<void> {
    // 1. See if product exists
    const product = await this.prisma.product.findUnique({
      where: { product_id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.prisma.productImage.deleteMany({
      where: { product_id: productId },
    });
    await this.prisma.product.delete({
      where: { product_id: productId },
    });
  }
  async getProductById(productId: number,tx?: Prisma.TransactionClient): Promise<ProductModel> {
    const prisma = tx? tx : this.prisma
    const product = await prisma.product.findUnique({
      where: { product_id: productId },
      include: { productImages: true,
        productCategories: {
          include: {
            category: true
          }
        }
       },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productMapper.toModelWithCategoryAndImages(product);
  }

  async productExist(productId:number): Promise<Boolean>{
    return this.prisma.product.findUnique({
      where:{ product_id: productId}
    }) != null
  }

  async checkStock(productId: number, quantity: number,tx?: Prisma.TransactionClient) {
    const prisma = tx? tx : this.prisma
    const product = await prisma.product.findUnique({
      where: { product_id: productId },
      select: { stock: true },
    })
    if(!product){
      throw new NotFoundException('Product not found');
    }
    return product?.stock >= quantity
  }

  async addStock(productId: number, quantity: number,tx?: Prisma.TransactionClient) {
    const prisma = tx? tx : this.prisma
    return prisma.product.update({
      where: { product_id: productId },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });    
  }
  async discountStock(productId: number, quantity: number,tx?: Prisma.TransactionClient) {
    const prisma = tx? tx : this.prisma
    if (quantity <= 0) return;
    const product = await prisma.product.findUnique({
        where: { product_id: productId },
        select: { stock: true },
    });

    if (!product) {
        throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
        throw new ForbiddenException('Product out of stock');
    }

    return prisma.product.update({
        where: { product_id: productId },
        data: {
            stock: {
              decrement: quantity,
            },
        },
      }
    );
  }

}
