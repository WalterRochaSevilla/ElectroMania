import { Mapper } from "src/common/interfaces/Mapper.interface";
import { ProductModel } from "../model/Product.model";
import { ProductImage } from "../entity/ProdctImage.entity";
import { RegisterProductImageRequestModel } from "../model/RegisterProductImageRequest.model";
import { ProductService } from "../service/product.service";
import { Product } from "../entity/Product.entity";

export class ProductImageMapper implements Mapper<ProductModel, ProductImage, RegisterProductImageRequestModel, Product> {
    toModel(entity: ProductImage): ProductModel {
        const model = new ProductModel();
        model.product_id = entity.product_id;
        model.product_name = entity.product.product_name;
        model.description = entity.product.description;
        model.price = entity.product.price;
        model.stock = entity.product.stock;
        model.state = entity.product.state;
        model.images = entity.product.productImages.map(image => image.image);
        return model;
    }

    toEntity(model: RegisterProductImageRequestModel,product:Product): ProductImage {
        const entity = new ProductImage();
        entity.product_id = product.product_id;
        entity.image = model.image_url;
        entity.product = product;
        return entity;
    }

}