import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { OrderService } from "../service/order.service";
import { CartService } from '../../cart/service/cart.service';
import { ProductService } from '../../product/service/product.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { CartUpdateRequest } from '../../cart/models/CartUpdateRequest.model';
import { CartState } from '../../cart/enums/CartState.enum';
import { OrderStatus } from "../models/order-response.model";


@Injectable()
export class CancelOrderUseCase {
  logger = new Logger('CancelOrderUseCase')
  constructor(
    private readonly orderService: OrderService,
    private readonly prisma: PrismaService,
    private readonly CartService: CartService,
    private readonly productService: ProductService
  ) {}

  async execute(orderId: number) {
    this.prisma.$transaction(async (tx) => {
      const order = await this.orderService.getById(orderId);
      if(!order){
        throw new NotFoundException('Order not found');
      }
      const updateCart: CartUpdateRequest ={
        id: order.cart.id,
        state: CartState.CANCELED
      }
      if(order.status === OrderStatus.PAID){
        await order.cart.details.forEach(async (detail) => {
          this.productService.addStock(detail.product.product_id, detail.quantity, tx);
        })
      }else{
        await order.cart.details.forEach(async (detail) => {
          this.productService.discountStock(detail.product.product_id, detail.quantity, tx);
        })
      }
      const cart = await this.CartService.updateCart(order.cart.id,
        updateCart
      )
      })
      await this.orderService.update(orderId,{
        orderId: orderId,
        status: OrderStatus.CANCELED
      })
      return this.orderService.getById(orderId)
    }
  
}