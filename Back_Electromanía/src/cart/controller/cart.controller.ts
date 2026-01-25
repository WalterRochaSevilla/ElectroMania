import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums/UserRole.enum';
import { CreateCartRequestDto } from '../dto/createCartRequest.dto';
import { AddProductToCartRequestDto, MinusProductToCartRequestDto } from '../dto/addProductToCartRequest.dto';
import { DeleteProductFromCartDto } from '../dto/delete-product-from-cart.dto';
import { AddProductToCartUseCase } from '../use-cases/add-product-to-cart.use-case';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
        private readonly addProductToCartUseCase:AddProductToCartUseCase
    ) {}

    @UseGuards(AuthGuard)
    @Post("create")
    async createCart(@Headers('authorization') token: string){
        console.log(token);
        return this.cartService.createCart(token.replace('Bearer ', ''));
    }

    @UseGuards(AuthGuard)
    @Get("")
    async getCart(@Headers('authorization') token: string){
        return this.cartService.getCartByUser(token.replace('Bearer ', ''));
    }

    @UseGuards(AuthGuard)
    @Post("addProduct")
    async addProductToCart(@Headers('authorization') token: string,@Body() addProductRequest:AddProductToCartRequestDto){
        return this.addProductToCartUseCase.execute(token, addProductRequest);
    }
    @UseGuards(AuthGuard)
    @Post("deleteProduct")
    async deleteProductToCart(@Headers('authorization') token: string,@Body() deleteRequest:DeleteProductFromCartDto){
        return this.cartService.deleteCartDetail(token.replace('Bearer ', ''), deleteRequest);
    }
    @UseGuards(AuthGuard)
    @Post("addStockProduct")
    async addStockProductToCart(@Headers('authorization') token: string,@Body() addProduct:AddProductToCartRequestDto){
        return 
    }
    @UseGuards(AuthGuard)
    @Post("minusStockProduct")
    async minusStockProductToCart(@Headers('authorization') token: string,@Body() minusProduct:MinusProductToCartRequestDto){
        return this.cartService.checkUpdateCartDetail(token.replace('Bearer ', ''), minusProduct);
    }
    
}
