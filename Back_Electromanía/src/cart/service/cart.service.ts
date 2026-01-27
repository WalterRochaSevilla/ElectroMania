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
    async checkCartDetail(cart_id: number, addProductRequest:AddProductToCartRequestDto,tx?:Prisma.TransactionClient) {
        const prisma = tx? tx : this.prisma
        const product = await this.productService.getProductById(addProductRequest.productId,prisma);
        const cartDetail = await prisma.cartDetails.findFirst({
            where: {
                cart_id: cart_id,
                product_id: addProductRequest.productId
            },
        })
        if(!cartDetail){
            return this.createCartDetail(cart_id, addProductRequest,prisma);
        }
        await this.checkUpdateCartDetail(cart_id, addProductRequest,prisma);
        const cart = await this.prisma.cart.findUnique({
            where: {
                cart_id: cart_id
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
                }
            }
        })
        if(!cart){
            return Promise.reject(new NotFoundException('Cart not found'));
        }
        return this.cartMapper.toModel(cart);
    }
    async checkUpdateCartDetail(cart_id: number, request:UpdateCartDetailDto,tx?:Prisma.TransactionClient) {
        const prisma = tx? tx : this.prisma
        let activeCart = await prisma.cart.findFirst({
            where: {
                cart_id: cart_id,
                state: "ACTIVE",
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
                }
            }
        });
        if(!activeCart){
            return Promise.reject(new NotFoundException('Cart not found'));
        }
        const cartDetail = await prisma.cartDetails.findFirst({
            where: {
                cart_id: activeCart.cart_id,
                product_id: request.productId
            },
        })
        if(!cartDetail){
            return Promise.reject(new NotFoundException('Product not found in cart'));
        }
        let options:Prisma.CartDetailsUpdateArgs;
        if(request.quantity < 0){
            if(cartDetail.quantity < Math.abs(request.quantity)){
                await this.deleteCartDetailById(cartDetail.id,prisma);
                return this.cartMapper.toModel(activeCart);
            }
            options = {
                where: {
                    id: activeCart.cart_id,
                    product_id: request.productId
                },
                data: {
                    quantity: {
                        decrement: Math.abs(request.quantity)
                    }
                }
            }
        }
        else{
            options = {
                where: {
                    id: activeCart.cart_id,
                    product_id: request.productId
                },
                data: {
                    quantity: {
                        increment: request.quantity
                    }
                }
            }
            await this.productService.discountStock(request.productId, request.quantity,prisma);
        }
        await this.updateCartDetail(cartDetail.id, options.data,prisma);
        activeCart = await prisma.cart.findFirst({
            where: {
                cart_id: activeCart.cart_id,
                state: "ACTIVE",
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
                }
            }
        })
        return activeCart? this.cartMapper.toModel(activeCart) : Promise.reject(new NotFoundException('Cart not found'));
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
    async deleteCartDetail(token :string,deleteProductRequest:DeleteProductFromCartDto,tx?:Prisma.TransactionClient) {
        const prisma = tx? tx : this.prisma
        const user = await this.authService.getUserFromToken(token);
        let activeCart = await prisma.cart.findFirst({
            where: {
                user_uuid: user.uuid,
                state: "ACTIVE",
            }
        })
        if(!activeCart){
            return Promise.reject(new NotFoundException('Cart not found'));
        }
        const cartDetail = await prisma.cartDetails.findFirst({
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
            cartDetail.quantity,
            prisma
        )
        return prisma.cartDetails.delete({
            where: {
                id: cartDetail.id
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
