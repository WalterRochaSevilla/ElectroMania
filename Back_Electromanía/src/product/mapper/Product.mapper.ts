import { ProductModel, ProductWithCategoriesAndImagesModel, ProductWithCategoriesModel } from "../model/Product.model";
import { CreateProductRequestModel } from '../model/CreateProductRequest.model';
import { Mapper } from "src/common/interfaces/Mapper.interface";

import { $Enums, Prisma, Product, ProductImage, ProductCategory, Category } from '@prisma/client';
import { CartProductModel, CartProductWithImagesModel } from '../../cart/models/CardProduct.model';
import { isInstance } from "class-validator";


export type ProductWithImages = Prisma.ProductGetPayload<{
  include: {
    productImages: true;
  };
}>;

export type ProductWithCategories = Prisma.ProductGetPayload<{
  include: {
    productCategories: { include: { category: true } };
  };
}>;

type ProductWithoutImages = Prisma.ProductGetPayload<{
  include: {
    productImages: false;
  };
}>;

export type ProductWithCategoriesAndImages = Prisma.ProductGetPayload<{
  include: {
    productCategories: { include: { category: true } };
    productImages: true;
  };
}>;

export class ProductMapper {

  toModel(entity: Product): ProductModel {
    const model = new ProductModel();
    model.product_id = entity.product_id;
    model.product_name = entity.product_name;
    model.description = entity.description;
    model.price = Number(entity.price);
    model.stock = entity.stock;
    model.state = entity.state;
    return model;
  }

  toEntity(model: CreateProductRequestModel): Prisma.ProductCreateInput {
    const entity: Prisma.ProductCreateInput = {
      product_name: model.product_name,
      description: model.description,
      price: model.price,
      stock: model.stock
    }
    if (model.image) {
      entity.productImages = {
        create: [{
          image: model.image
        }]
      }
    }
    if (model.category_id) {
      entity.productCategories = {
        create: [{
          category_id: model.category_id
        }]
      }
    }
    return entity
  }
  toUpdateEntity(model: Partial<CreateProductRequestModel>): Prisma.ProductUpdateInput {
    const result: Prisma.ProductUpdateInput = {};

    // Only include fields that are provided, and convert strings to proper types
    if (model.product_name !== undefined) {
      result.product_name = model.product_name;
    }
    if (model.description !== undefined) {
      result.description = model.description;
    }
    if (model.price !== undefined) {
      // FormData sends as string, convert to number
      result.price = typeof model.price === 'string' ? parseFloat(model.price) : model.price;
    }
    if (model.stock !== undefined) {
      // FormData sends as string, convert to number
      result.stock = typeof model.stock === 'string' ? parseInt(model.stock, 10) : model.stock;
    }

    return result;
  }
  toCartProduct(entity: ProductWithImages): CartProductModel {
    const model = new CartProductWithImagesModel();
    model.product_id = entity.product_id;
    model.product_name = entity.product_name;
    model.description = entity.description || '';
    model.price = Number(entity.price);
    model.images = entity.productImages ? entity.productImages.map(img => img.image) : [];
    return model;
  }
  toCartProductWithoutImages(entity: ProductWithoutImages): CartProductModel {
    const model = new CartProductModel();
    model.product_id = entity.product_id;
    model.product_name = entity.product_name;
    model.description = entity.description || '';
    model.price = Number(entity.price);
    return model;
  }
  toModelWithCategory(productWithCategories: ProductWithCategories): ProductModel {
    const model = new ProductWithCategoriesModel();
    model.product_id = productWithCategories.product_id;
    model.product_name = productWithCategories.product_name;
    model.description = productWithCategories.description;
    model.price = Number(productWithCategories.price);
    model.stock = productWithCategories.stock;
    model.state = productWithCategories.state;
    model.categories = productWithCategories.productCategories.map((category) => category.category.category_name);
    return model;
  }
  toModelWithCategoryAndImages(productWithCategoriesAndImages: ProductWithCategoriesAndImages): ProductModel {
    const model = new ProductWithCategoriesAndImagesModel();
    model.product_id = productWithCategoriesAndImages.product_id;
    model.product_name = productWithCategoriesAndImages.product_name;
    model.description = productWithCategoriesAndImages.description;
    model.price = Number(productWithCategoriesAndImages.price);
    model.stock = productWithCategoriesAndImages.stock;
    model.state = productWithCategoriesAndImages.state;
    model.categories = productWithCategoriesAndImages.productCategories.map((category) => category.category.category_name);
    model.images = productWithCategoriesAndImages.productImages.map((img) => img.image);
    return model;
  }
  toModelWithoutProductImages(entity: ProductWithoutImages): ProductModel {
    const model = new ProductModel();
    model.product_id = entity.product_id;
    model.product_name = entity.product_name;
    model.description = entity.description;
    model.price = Number(entity.price);
    model.stock = entity.stock;
    model.state = entity.state;
    return model;
  }
}