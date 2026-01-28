import { ForbiddenException, Injectable, NotFoundException, Delete } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ProductService } from '../../product/service/product.service';
import { UserService } from '../../user/service/user.service';
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

    async createCart(uuid:string, tx?:Prisma.TransactionClient ){
        const prisma = tx? tx : this.prisma
        const cart =await prisma.cart.create({
            data: {
                user:{
                    connect: {
                        uuid: uuid
                    }
                },
                created_at: new Date()
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
        })
        return this.cartMapper.toModel(cart);
    }
    async getCartDetailById(id: number, tx?:Prisma.TransactionClient) {
        const prisma = tx? tx : this.prisma
        return prisma.cartDetails.findUnique({
            where: { id: id },
            include: {
                product: {
                    include: {
                        productImages: true
                    }
                }
            },
        });
    }
    async getActiveCartByUser(uuid: string, tx?:Prisma.TransactionClient) {
        const prisma = tx? tx : this.prisma
        const cart = await prisma.cart.findFirst({
            where: { 
                user:{
                    uuid: uuid
                },
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
            return this.createCart(uuid, prisma);
        }
        return this.cartMapper.toModel(cart);
    }
    async getCartDetailByCartAndProduct(cart_id: number, product_id: number, tx?:Prisma.TransactionClient) {
        const prisma = tx? tx : this.prisma
        return prisma.cartDetails.findFirst({
            where: { 
                cart_id: cart_id,
                product_id: product_id
            },
            include: {
                product: {
                    include: {
                        productImages: true
                    }
                }
            },
        });
    }
    async increaseQuantity(cartDetail_id: number, request:UpdateCartDetailDto, tx?:Prisma.TransactionClient) {
        const prisma = tx? tx : this.prisma
        const options={
            where: {
                id: cartDetail_id
            },
            data: {
                quantity: {
                    increment: request.quantity
                }
            }
        }
        return this.updateCartDetail(cartDetail_id, options.data, prisma);
    }
    async decreaseQuantity(cartDetail_id: number, request:UpdateCartDetailDto, tx?:Prisma.TransactionClient) {
        const prisma = tx? tx : this.prisma
        const options={
            where: {
                id: cartDetail_id
            },
            data: {
                quantity: {
                    decrement: request.quantity
                }
            }
        }
        return this.updateCartDetail(cartDetail_id, options.data, prisma);
    }
    async createCartDetail(cart_id: number, addProductRequest:AddProductToCartRequestDto,tx?:Prisma.TransactionClient) {
        const prisma = tx? tx : this.prisma
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
            addProductRequest.quantity,
            prisma
        )
        return prisma.cartDetails.create({
            data: cartDetails
        })
    }
    async updateCartDetail(cartDetailId: number,cartDetail:Prisma.CartDetailsUpdateInput,tx?:Prisma.TransactionClient,options?:Prisma.CartDetailsUpdateArgs) {
        const prisma = tx? tx : this.prisma
        return prisma.cartDetails.update({
            where: {
                id: cartDetailId
            },
            data: cartDetail,
            ...options
        })
    }
    async deleteCartDetailById(cartDetailId: number,tx?:Prisma.TransactionClient) {
        const prisma = tx? tx : this.prisma
        const cartDetail = await prisma.cartDetails.findUnique({
            where: {
                id: cartDetailId
            }
        })
        if(!cartDetail){
            return Promise.reject(new NotFoundException('Cart detail not found'));
        }
        return prisma.cartDetails.delete({
            where: {
                id: cartDetailId
            }
        })
    }

    async updateCart(cartId: number,cartUpdateRequest:CartUpdateRequest){
        let updateData;
        if(cartUpdateRequest.state){
            updateData = {
                state: cartUpdateRequest.state
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
