import { Product } from "../entity/Product.entity";
import { ProductModel } from "../model/Product.model";
import { CreateProductRequestModel } from "../model/CreateProductRequest.model";
import { Mapper } from "src/common/interfaces/Mapper.interface";
import { ProductImage } from "../entity/ProdctImage.entity";

export class ProductMapper implements Mapper<ProductModel,Product,CreateProductRequestModel,ProductImage> {

    toModel(entity: Product): ProductModel {
        const model = new ProductModel();
        model.product_id = entity.product_id;
        model.product_name = entity.product_name;
        model.description = entity.description;
        model.price = entity.price;
        model.stock = entity.stock;
        model.state = entity.state;
        model.images = entity.productImages.map(image => image.image);
        return model;
    }

    toEntity(model: CreateProductRequestModel): Product {
        const product = new Product();
        product.product_name = model.name;
        product.description = model.description;
        product.price = model.price;
        product.stock = model.stock;
        return product;
    }
}