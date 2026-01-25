import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { DeleteProductFromCartDto } from '../dto/delete-product-from-cart.dto';
import { AddProductToCartUseCase } from '../use-cases/add-product-to-cart.use-case';
import { UpdateCartDetailDto } from '../dto/update-cart-detail.dto';
import { UpdateProductQuantityUseCase } from '../use-cases/update-product-quantity.use-case';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
        private readonly addProductToCartUseCase:AddProductToCartUseCase,
        private readonly updateCartDetails: UpdateProductQuantityUseCase
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
    async addProductToCart(@Headers('authorization') token: string,@Body() updateRequest:UpdateCartDetailDto){
        return this.addProductToCartUseCase.execute(token, updateRequest);
    }
    @UseGuards(AuthGuard)
    @Post("deleteProduct")
    async deleteProductToCart(@Headers('authorization') token: string,@Body() deleteRequest:DeleteProductFromCartDto){
        return this.cartService.deleteCartDetail(token.replace('Bearer ', ''), deleteRequest);
    }
    @UseGuards(AuthGuard)
    @Post("update")
    async updateCartDetail(@Headers('authorization') token: string,@Body() addProduct:UpdateCartDetailDto){
        return this.updateCartDetails.execute(token, addProduct);
    }
    
}
