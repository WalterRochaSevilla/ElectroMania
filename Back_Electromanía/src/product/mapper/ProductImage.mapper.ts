import { Mapper } from "src/common/interfaces/Mapper.interface";
import { ProductModel, ProductWithImagesModel } from "../model/Product.model";
import { RegisterProductImageRequestModel } from "../model/RegisterProductImageRequest.model";
import { Product, ProductImage, Prisma } from "@prisma/client";

type ProductImageWithProduct = Prisma.ProductImageGetPayload<{
  include: { product: { include: { productImages: true } } };
}>;


export class ProductImageMapper
{
  toModel(entity: ProductImageWithProduct):ProductModel  {
    const model = new ProductWithImagesModel();
    model.product_id = entity.product_id;
    model.product_name = entity.product.product_name;
    model.description = entity.product.description;
    model.price = Number(entity.product.price);
    model.stock = entity.product.stock;
    model.state = entity.product.state;
    model.images = entity.product.productImages
      ? entity.product.productImages.map((img) => img.image)
      : [];
    return model;
  }

  toEntity(
    model: RegisterProductImageRequestModel,
    product: Product
  ): Prisma.ProductImageCreateInput {
    return {
      product: {
        connect: { product_id: product.product_id },
      },
      image: model.image_url,
    };
  }
}
