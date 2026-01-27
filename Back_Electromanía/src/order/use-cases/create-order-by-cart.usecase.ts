import { OrderService } from '../service/order.service';
import { CartService } from '../../cart/service/cart.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ProductService } from '../../product/service/product.service';

@Injectable()
export class CreateOrderByCartUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
  ){}
  async execute(userUuid: string) {
    return  this.prisma.$transaction(async (tx) => {
      const cart = await this.cartService.getActiveCartByUser(userUuid,tx);
      if(!cart){
        throw new NotFoundException('Cart active not found');
      }
      if(cart.details.length === 0){
        throw new NotFoundException('Cart is empty');
      }
      cart.details.forEach((detail) => {
        this.productService.checkStock(detail.product.product_id, detail.quantity, tx);
      })
      await this.cartService.updateCart(cart.id,{
        id: cart.id,
        state: 'COMPLETED'
      })
      const order = await this.orderService.register(userUuid,cart,tx);
      await this.orderService.saveOrderItems(cart,order.id,tx);
      return order;
    })
  }
}