import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums/UserRole.enum';
import { CreateCartRequestDto } from '../dto/createCartRequest.dto';
import { AddProductToCartRequestDto } from '../dto/addProductToCartRequest.dto';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService
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
        return this.cartService.addProductToCart(token.replace('Bearer ', ''), addProductRequest);
    }
}
