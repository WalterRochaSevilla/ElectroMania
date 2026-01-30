import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { DeleteProductFromCartDto } from '../dto/delete-product-from-cart.dto';
import { AddProductToCartUseCase } from '../use-cases/add-product-to-cart.use-case';
import { UpdateCartDetailDto } from '../dto/update-cart-detail.dto';
import { UpdateProductQuantityUseCase } from '../use-cases/update-product-quantity.use-case';
import { GetActiveCartUseCase } from '../use-cases/get-active-cart.use-case';
import { RemoveProductFromCartUseCase } from '../use-cases/remove-product-from-cart-use-case';
import { AuthService } from '../../auth/service/auth.service';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
        private readonly authService: AuthService,
        private readonly removeProductFromCartUseCase:RemoveProductFromCartUseCase,
        private readonly addProductToCartUseCase:AddProductToCartUseCase,
        private readonly updateCartDetails: UpdateProductQuantityUseCase,
        private readonly getActiveCartUSeCase:GetActiveCartUseCase
    ) {}

    @UseGuards(AuthGuard)
    @Post("create")
    async createCart(@Headers('authorization') token: string){
        return this.cartService.createCart(token.replace('Bearer ', ''));
    }

    @UseGuards(AuthGuard)
    @Get("")
    async getCart(@Headers('authorization') token: string){
        const user = await this.authService.getUserFromToken(token.replace('Bearer ', ''));
        return this.getActiveCartUSeCase.execute(user.uuid);
    }

    @UseGuards(AuthGuard)
    @Post("addProduct")
    async addProductToCart(@Headers('authorization') token: string,@Body() updateRequest:UpdateCartDetailDto){
        const user = await this.authService.getUserFromToken(token.replace('Bearer ', ''));
        return this.addProductToCartUseCase.execute(user.uuid, updateRequest);
    }
    @UseGuards(AuthGuard)
    @Post("deleteProduct")
    async deleteProductToCart(@Headers('authorization') token: string,@Body() deleteRequest:DeleteProductFromCartDto){
        const user = await this.authService.getUserFromToken(token.replace('Bearer ', ''));
        return this.removeProductFromCartUseCase.execute(user.uuid, deleteRequest);
    }
    @UseGuards(AuthGuard)
    @Post("update")
    async updateCartDetail(@Headers('authorization') token: string,@Body() addProduct:UpdateCartDetailDto){
        const user = await this.authService.getUserFromToken(token.replace('Bearer ', ''));
        return this.updateCartDetails.execute(user.uuid, addProduct);
    }
    
}
