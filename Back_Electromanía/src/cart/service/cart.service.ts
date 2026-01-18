import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ProductService } from '../../product/service/product.service';
import { UserService } from '../../user/service/user.service';
import { CreateCartRequestDto } from '../dto/createCartRequest.dto';
import { CartMapper } from '../mapper/cart.mapper';
import { AuthService } from '../../auth/service/auth.service';
import { AddProductToCartRequestDto } from '../dto/addProductToCartRequest.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly productService: ProductService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly cartMapper: CartMapper
    ){}

    async createCart(token:string ){
        try{
            const user = await this.authService.getUserFromToken(token);
            return this.prisma.cart.create({
                data: {
                    user_uuid: user.uuid,
                    created_at: new Date()
                }
            })
        }catch(error){
            return Promise.reject(error);
        }
    }
    async getCartByUser(token: string) {
        const user = await this.authService.getUserFromToken(token);

        const cart = await this.prisma.cart.findFirst({
            where: { 
                user_uuid: user.uuid,
                state: "ACTIVE"
            },
            include: {
                cartDetails: {
                include: {
                    product: {
                        include: {
                            productImages: true
                        }
                    }
                },
            },
        },
        });
        if(!cart){
            return this.createCart(token);
        }
        return this.cartMapper.toModel(cart);
    }
    async addProductToCart(token: string, addProductRequest:AddProductToCartRequestDto) {
        const user = await this.authService.getUserFromToken(token);
        let activeCart = await this.prisma.cart.findFirst({
            where: {
                user_uuid: user.uuid,
                state: "ACTIVE"
            }
        })
        if(activeCart){
            return this.createCartDetail(activeCart.cart_id, addProductRequest);
        }else{
            activeCart = await this.createCart(token);
            return this.createCartDetail(activeCart.cart_id, addProductRequest);
        }
    }

    async createCartDetail(cart_id: number, addProductRequest:AddProductToCartRequestDto) {
        const product = await this.productService.getProductById(addProductRequest.productId);
        const cartDetails = {
            cart_id: cart_id,
            product_id: addProductRequest.productId,
            quantity: addProductRequest.quantity,
            unit_price: product.price,
            sub_total: product.price * addProductRequest.quantity
        } as Prisma.CartDetailsCreateInput
        return this.prisma.cartDetails.create({
            data: cartDetails
        })
    }
}
