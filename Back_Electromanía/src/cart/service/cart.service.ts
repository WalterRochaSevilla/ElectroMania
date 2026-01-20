import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ProductService } from '../../product/service/product.service';
import { UserService } from '../../user/service/user.service';
import { CreateCartRequestDto } from '../dto/createCartRequest.dto';
import { CartMapper } from '../mapper/cart.mapper';
import { AuthService } from '../../auth/service/auth.service';
import { AddProductToCartRequestDto } from '../dto/addProductToCartRequest.dto';
import { Prisma } from '@prisma/client';
import { CartUpdateRequest } from '../models/CartUpdateRequest.model';

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
                state: "ACTIVE",
            }
        })
        if(!activeCart){
            activeCart = await this.createCart(token);
        }
        return this.checkCartDetail(activeCart.cart_id, addProductRequest);
    }

    async createCartDetail(cart_id: number, addProductRequest:AddProductToCartRequestDto) {
        const product = await this.productService.getProductById(addProductRequest.productId);
        const cartDetails = {
            cart_id: cart_id,
            product_id: addProductRequest.productId,
            quantity: addProductRequest.quantity,
            unit_price: product.price,
            cart: {
                connect: {
                    cart_id: cart_id
                }
            },
            product: {
                connect: {
                    product_id: addProductRequest.productId
                }
            }
        } as Prisma.CartDetailsCreateInput
        await this.productService.discountStock(
            addProductRequest.productId,
            addProductRequest.quantity
        )
        return this.prisma.cartDetails.create({
            data: cartDetails
        })
    }
    private async checkCartDetail(cart_id: number, addProductRequest:AddProductToCartRequestDto) {
        const product = await this.productService.getProductById(addProductRequest.productId);
        if(!product){
            throw new NotFoundException('Product not found');
        }
        const cartDetail = await this.prisma.cartDetails.findFirst({
            where: {
                cart_id: cart_id,
                product_id: addProductRequest.productId
            },
        })
        if(!cartDetail){
            return this.createCartDetail(cart_id, addProductRequest);
        }
        return this.updateCartDetail(cart_id, addProductRequest);
    }
    async updateCartDetail(cart_id: number, addProductRequest:AddProductToCartRequestDto) {
        const cartDetail = await this.prisma.cartDetails.findFirst({
            where: {
                cart_id: cart_id,
                product_id: addProductRequest.productId
            },
        })
        if(!cartDetail){
            return this.createCartDetail(cart_id, addProductRequest);
        }
        const product = await this.productService.getProductById(addProductRequest.productId);
        await this.productService.discountStock(
            addProductRequest.productId,
            addProductRequest.quantity
        )
        const cartDetails = {
            cart_id: cart_id,
            product_id: addProductRequest.productId,
            quantity: {
                increment: addProductRequest.quantity
            },
            unit_price: product.price,
            sub_total: product.price * (cartDetail.quantity + addProductRequest.quantity)
        } as Prisma.CartDetailsUpdateInput
        return this.prisma.cartDetails.update({
            where: {
                id: cartDetail.id
            },
            data: cartDetails
        })
    }
    async updateCart(cartId: number,cartUpdateRequest:CartUpdateRequest){
        let updateData;
        if(cartUpdateRequest.state){
            updateData = {
                state: cartUpdateRequest.state,
                total: cartUpdateRequest.total
            } as Prisma.CartUpdateInput
        }else{
            updateData = {
                total: cartUpdateRequest.total
            } as Prisma.CartUpdateInput
        }
        return this.prisma.cart.update({
            where: {
                cart_id: cartId
            },
            data: updateData
        })
    }
}
