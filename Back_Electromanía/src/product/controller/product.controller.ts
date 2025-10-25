import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductModule } from '../product.module';
import { CreateProductRequestModel } from '../model/CreateProductRequest.model';
import { RegisterProductImageRequestModel } from '../model/RegisterProductImageRequest.model';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ){}

    @Get("all")
    getAllProducts(): Promise<ProductModule[]>{
        return this.productService.getAllProducts();
    }

    @Post("register")
    registerProduct(@Body()product: CreateProductRequestModel): Promise<ProductModule>{
        return this.productService.createProduct(product);
    }

    @Post("addImage")
    registerProductImage(@Body()productImage: RegisterProductImageRequestModel): Promise<ProductModule>{
        return this.productService.registerProductImage(productImage);
    }

}
