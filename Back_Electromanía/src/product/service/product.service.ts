import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ProductMapper } from '../mapper/Product.mapper';
import { ProductImageMapper } from '../mapper/ProductImage.mapper';
import { PageProductMapper } from '../mapper/PageProduct.mapper';
import { ProductModel } from '../model/Product.model';
import { CreateProductRequestModel } from '../model/CreateProductRequest.model';
import { RegisterProductImageRequestModel } from '../model/RegisterProductImageRequest.model';
import { PageProductResponseModel } from '../model/PageProductResponse.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  private readonly productMapper = new ProductMapper();
  private readonly productImageMapper = new ProductImageMapper();
  private readonly pageProductMapper = new PageProductMapper();

  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductRequestModel): Promise<ProductModel> {
    const data = this.productMapper.toEntity(dto);
    const product = await this.prisma.product.create({ data });
    return this.productMapper.toModel(product);
  }

  async registerProductImage(
    dto: RegisterProductImageRequestModel,
  ): Promise<ProductModel> {
    const product = await this.prisma.product.findUnique({
      where: { product_name: dto.name },
      include: { productImages: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const imageData = this.productImageMapper.toEntity(dto, product);
    await this.prisma.productImage.create({ data: imageData });

    const updated = await this.prisma.product.findUnique({
      where: { product_id: product.product_id },
      include: { productImages: true },
    });

    return this.productMapper.toModel(updated!);
  }

  async getAllProducts(): Promise<ProductModel[]> {
    const products = await this.prisma.product.findMany({
      include: { productImages: true },
    });
    return products.map((p) => this.productMapper.toModel(p));
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
      include: { productImages: true },
    });
    return products.map((p) => this.productMapper.toModel(p));
  }


  async getFilterBy(filter: Prisma.ProductWhereInput): Promise<ProductModel[]> {
    const products = await this.prisma.product.findMany({
      where: filter,
      include: { productImages: true },
    });

    return products.map((p) => this.productMapper.toModel(p));
  }

  async updateProduct(
    productId: number,
    dto: Partial<CreateProductRequestModel>,
  ): Promise<ProductModel> {
    const updated = await this.prisma.product.update({
      where: { product_id: productId },
      data: this.productMapper.toUpdateEntity(dto),
      include: { productImages: true },
    });

    return this.productMapper.toModel(updated);
  }

  // Delete product by id -> first delete associated images, then delete product
  async deleteProduct(productId: number): Promise<void> {
    // 1. See if product exists
    const product = await this.prisma.product.findUnique({
      where: { product_id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 2. Delete associated images
    await this.prisma.productImage.deleteMany({
      where: { product_id: productId },
    });

    // 3. Delete product
    await this.prisma.product.delete({
      where: { product_id: productId },
    });
  }

}
