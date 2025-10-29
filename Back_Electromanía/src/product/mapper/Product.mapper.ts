import { ProductModel } from "../model/Product.model";
import { CreateProductRequestModel } from "../model/CreateProductRequest.model";
import { Mapper } from "src/common/interfaces/Mapper.interface";

import { $Enums, Prisma, Product, ProductImage} from "@prisma/client"

export class ProductMapper implements Mapper<ProductModel,Product,Prisma.ProductCreateInput,CreateProductRequestModel,ProductImage> {

    toModel(entity: Product & {productImages?: ProductImage[]} ): ProductModel {
        const model = new ProductModel();
        model.product_id = entity.product_id;
        model.product_name = entity.product_name;
        model.description = entity.description;
        model.price = Number(entity.price);
        model.stock = entity.stock;
        model.state = entity.state;
        model.images =entity.productImages ? entity.productImages.map(img => img.image) : [];;
        return model;
    }

    toEntity(model: CreateProductRequestModel): Prisma.ProductCreateInput {
        return{
            product_name: model.name,
            description: model.description,
            price: model.price,
            stock: model.stock
        }
    }   
}