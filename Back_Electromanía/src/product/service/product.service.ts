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
import { CloudflareR2Service } from '../../cloudflare-r2/cloudflare-r2.service';

@Injectable()
export class ProductService {
  private readonly productMapper = new ProductMapper();
  private readonly productImageMapper = new ProductImageMapper();
  private readonly pageProductMapper = new PageProductMapper();

  constructor(
    private readonly prisma: PrismaService,
    private readonly r2Service: CloudflareR2Service,
  ) { }

  async createProduct(dto: CreateProductRequestModel, image?: Express.Multer.File): Promise<ProductModel> {
    const data = this.productMapper.toEntity(dto);

    if (image) {
      // Process and upload image to Cloudflare R2
      const processedBuffer = await this.r2Service.processImage(image.buffer);
      const timestamp = Date.now();
      const key = `products/${timestamp}.webp`;

      const uploadResult = await this.r2Service.uploadPublic(
        processedBuffer,
        key,
        'image/webp',
      );

      data.productImages = {
        create: [{ image: uploadResult.url }],
      };
    }

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
    dto: RegisterProductImageRequestModel,
  ): Promise<ProductModel> {
    const product = await this.prisma.product.findUnique({
      where: { product_name: dto.name },
      include: { productImages: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete existing record if same image URL exists (allows "reordering" by re-adding)
    await this.prisma.productImage.deleteMany({
      where: {
        product_id: product.product_id,
        image: dto.image_url
      }
    });

    const imageData = this.productImageMapper.toEntity(dto, product);
    await this.prisma.productImage.create({ data: imageData });

    const updated = await this.prisma.product.findUnique({
      where: { product_id: product.product_id },
      include: {
        productImages: true,
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
    try {
      const products = await this.prisma.product.findMany({
        include: {
          productImages: true,
          productCategories: {
            include: {
              category: true
            }
          }
        },
      });
      if (products.length === 0) {
        throw new NotFoundException('Products not found');
      }
      return products.map((p) => this.productMapper.toModelWithCategoryAndImages(p));
    } catch (e) {
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
      include: {
        productImages: true,
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
      include: {
        productImages: true,
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
    image?: Express.Multer.File,
  ): Promise<ProductModel> {
    // If an image was uploaded, process and upload it to R2
    if (image) {
      const processedBuffer = await this.r2Service.processImage(image.buffer);
      const timestamp = Date.now();
      const key = `products/${productId}_${timestamp}.webp`;

      const uploadResult = await this.r2Service.uploadPublic(
        processedBuffer,
        key,
        'image/webp',
      );

      // Add the new image to the product
      await this.prisma.productImage.create({
        data: {
          product_id: productId,
          image: uploadResult.url,
        },
      });
    }

    const updated = await this.prisma.product.update({
      where: { product_id: productId },
      data: this.productMapper.toUpdateEntity(dto),
      include: {
        productImages: true,
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
    // 1. Find product with images
    const product = await this.prisma.product.findUnique({
      where: { product_id: productId },
      include: { productImages: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 2. Delete images from R2
    for (const img of product.productImages) {
      // Extract key from URL (format: https://pub-xxx.r2.dev/products/123.webp)
      const key = this.extractR2KeyFromUrl(img.image);
      if (key) {
        try {
          await this.r2Service.delete(key, 'assets');
        } catch (error) {
          // Log but don't fail if R2 delete fails
          console.error(`Failed to delete image from R2: ${key}`, error);
        }
      }
    }

    // 3. Delete from database
    await this.prisma.productImage.deleteMany({
      where: { product_id: productId },
    });
    await this.prisma.product.delete({
      where: { product_id: productId },
    });
  }

  /**
   * Extract R2 key from a public URL
   * Example: https://pub-xxx.r2.dev/products/123.webp -> products/123.webp
   */
  private extractR2KeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      // Remove leading slash from pathname
      return urlObj.pathname.slice(1);
    } catch {
      return null;
    }
  }
  async getProductById(productId: number): Promise<ProductModel> {
    const product = await this.prisma.product.findUnique({
      where: { product_id: productId },
      include: {
        productImages: true,
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

  async productExist(productId: number): Promise<Boolean> {
    return this.prisma.product.findUnique({
      where: { product_id: productId }
    }) != null
  }
  async addStock(productId: number, quantity: number) {
    if (quantity <= 0) return;
    return this.prisma.product.update({
      where: { product_id: productId },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });
  }

  async discountStock(productId: number, quantity: number) {
    if (quantity <= 0) return;

    const product = await this.prisma.product.findUnique({
      where: { product_id: productId },
      select: { stock: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new ForbiddenException('Product out of stock');
    }

    return this.prisma.product.update({
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
