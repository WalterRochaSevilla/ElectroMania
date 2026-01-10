import { Body, Controller, Get, Param, Post, Query, UseGuards, Delete } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductModule } from '../product.module';
import { CreateProductRequestModel } from '../model/CreateProductRequest.model';
import { RegisterProductImageRequestModel } from '../model/RegisterProductImageRequest.model';
import { PageProductResponseModel } from '../model/PageProductResponse.model';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums/UserRole.enum';


@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ){}

    @Get("Conection")
    testConection()
    {
        return { status: 'ok', data : []};
    }

    @Get("all")
    getAllProducts(): Promise<ProductModule[]>{
        return this.productService.getAllProducts();
    }

    @Get("")
    getPage(@Query("page") page: number): Promise<PageProductResponseModel>{
        return this.productService.getPageProduct(page);
    }

    @UseGuards(AuthGuard,RolesGuard)
    @Post("register")
    registerProduct(@Body()product: CreateProductRequestModel): Promise<ProductModule>{
        return this.productService.createProduct(product);
    }
    
    @Roles(UserRole.USER)
    @UseGuards(AuthGuard,RolesGuard)
    @Post("addImage")
    registerProductImage(@Body()productImage: RegisterProductImageRequestModel): Promise<ProductModule>{
        return this.productService.registerProductImage(productImage);
    }

    // Delete product endpoint -> To need the id of the product
    @Delete('delete/:id')
    async delete(@Param('id') id: string): Promise<{ message: string }> 
    {
        await this.productService.deleteProduct(Number(id));
        return { message: 'Producto eliminado correctamente' }; // suggested message for terminal output
    }
}