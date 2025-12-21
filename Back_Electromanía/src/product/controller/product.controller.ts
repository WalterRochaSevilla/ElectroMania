import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductModule } from '../product.module';
import { CreateProductRequestModel } from '../model/CreateProductRequest.model';
import { RegisterProductImageRequestModel } from '../model/RegisterProductImageRequest.model';
import { PageProductResponseModel } from '../model/PageProductResponse.model';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ){}

    @Get("all")
    getAllProducts(): Promise<ProductModule[]>{
        return this.productService.getAllProducts();
    }

    @Get("")
    getPage(@Query("page") page: number): Promise<PageProductResponseModel>{
        return this.productService.getPageProduct(page);
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
