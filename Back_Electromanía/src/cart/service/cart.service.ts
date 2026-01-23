import { ForbiddenException, Injectable, NotFoundException, Delete } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ProductService } from '../../product/service/product.service';
import { UserService } from '../../user/service/user.service';
import { CreateCartRequestDto } from '../dto/createCartRequest.dto';
import { CartMapper } from '../mapper/cart.mapper';
import { AuthService } from '../../auth/service/auth.service';
import { AddProductToCartRequestDto, MinusProductToCartRequestDto } from '../dto/addProductToCartRequest.dto';
import { Prisma } from '@prisma/client';
import { CartUpdateRequest } from '../models/CartUpdateRequest.model';
import { DeleteProductFromCartDto } from '../dto/delete-product-from-cart.dto';
import { UpdateCartDetailDto } from '../dto/update-cart-detail.dto';
import * as request from 'supertest';

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
    async getCartEntityByUser(token: string) {
        const user = await this.authService.getUserFromToken(token);
        return this.prisma.cart.findFirst({
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
        return this.addStockProductToCart(cartDetail.id, addProductRequest);
    }
    async checkUpdateCartDetail(token: string, request:UpdateCartDetailDto) {
        const activeCart = await this.getCartEntityByUser(token);
        if(!activeCart){
            return Promise.reject(new NotFoundException('Cart not found'));
        }
        const cartDetail = await this.prisma.cartDetails.findFirst({
            where: {
                cart_id: activeCart.cart_id,
                product_id: request.productId
            },
        })
        if(!cartDetail){
            return Promise.reject(new NotFoundException('Product not found in cart'));
        }
        if(request instanceof AddProductToCartRequestDto){
            return this.addStockProductToCart(cartDetail.id, request);
        }else{
            return this.minusStockProductToCart(cartDetail.id, request);
        }
    }
    async addStockProductToCart(cardDetailId: number, addProductRequest:AddProductToCartRequestDto) {
        const product = await this.productService.getProductById(addProductRequest.productId);
        if(product.stock < addProductRequest.quantity){
            throw new ForbiddenException('Product out of stock');
        }
        const cartDetailUpdate:Prisma.CartDetailsUpdateInput = {
            quantity: {
                increment: addProductRequest.quantity
            }
        }
        await this.productService.discountStock(
            addProductRequest.productId,
            addProductRequest.quantity
        )
        return this.updateCartDetail(cardDetailId, cartDetailUpdate);
    }
    async minusStockProductToCart(cartDetailId: number, minusProductRequest:MinusProductToCartRequestDto) {
        const product = await this.productService.getProductById(minusProductRequest.productId);
        if(product.stock < minusProductRequest.quantity){
            throw new ForbiddenException('Product out of stock');
        }
        const cartDetailUpdate:Prisma.CartDetailsUpdateInput = {
            quantity: {
                decrement: minusProductRequest.quantity
            }
        }
        await this.productService.addStock(
            minusProductRequest.productId,
            minusProductRequest.quantity
        )
        return this.updateCartDetail(cartDetailId, cartDetailUpdate);
    }
    async updateCartDetail(cartDetailId: number,cartDetail:Prisma.CartDetailsUpdateInput){
        return this.prisma.cartDetails.update({
            where: {
                id: cartDetailId
            },
            data: cartDetail
        })
    }
    async deleteCartDetailById(cartDetailId: number) {
        const cartDetail = await this.prisma.cartDetails.findUnique({
            where: {
                id: cartDetailId
            }
        })
        if(!cartDetail){
            return Promise.reject(new NotFoundException('Cart detail not found'));
        }
        await this.productService.addStock(
            cartDetail.product_id,
            cartDetail.quantity
        )
        return this.prisma.cartDetails.delete({
            where: {
                id: cartDetailId
            }
        })
    }
    async deleteCartDetail(token :string,deleteProductRequest:DeleteProductFromCartDto) {
        const user = await this.authService.getUserFromToken(token);
        let activeCart = await this.prisma.cart.findFirst({
            where: {
                user_uuid: user.uuid,
                state: "ACTIVE",
            }
        })
        if(!activeCart){
            return Promise.reject(new NotFoundException('Cart not found'));
        }
        const cartDetail = await this.prisma.cartDetails.findFirst({
            where: {
                cart_id: activeCart.cart_id,
                product_id: deleteProductRequest.productId
            },
        })
        if(!cartDetail){
            return Promise.reject(new NotFoundException('Product not found in cart'));
        }
        await this.productService.addStock(
            deleteProductRequest.productId,
            cartDetail.quantity
        )
        return this.prisma.cartDetails.delete({
            where: {
                id: cartDetail.id
            }
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
