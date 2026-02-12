import { PrismaService } from '../../prisma/service/prisma.service';
import { CartService } from '../../cart/service/cart.service';
import { OrderService } from '../service/order.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CartUpdateRequest } from '../../cart/models/CartUpdateRequest.model';
import { ProductService } from '../../product/service/product.service';
import { OrderStatus } from '../models/order-response.model';
import { PaymentService } from '../../payment/service/payment.service';
import { PaymentMethod, PaymentStatus } from 'src/payment/dto/register-payment.dto';
import { SendOrderReceiptUseCase } from './send-order-receipt.use-case';
import { GenerateOrderXmlUseCase } from './generate-order-xml.usecase';

@Injectable()
export class ConfirmPaymentForOrderUseCase {
  logger = new Logger('ConfirmPaymentForOrderUseCase')
  constructor(
    private readonly prisma:PrismaService,
    private readonly cartService:CartService,
    private readonly orderService: OrderService,
    private readonly productService:ProductService,
    private readonly paymentService:PaymentService,
    private readonly sendOrderByEmail:SendOrderReceiptUseCase,
    private readonly generateHtml:GenerateOrderXmlUseCase
  ){}
  async execute(orderId:number){
    const result = await this.prisma.$transaction(async (tx) => {
      const order = await this.orderService.getById(orderId);
      if(!order){
        throw new NotFoundException('Order not found');
      }
      const updateCart: CartUpdateRequest ={
        id: order.cart.id,
        state: 'COMPLETED'
      }
      const cart = await this.cartService.updateCart(order.cart.id,
        updateCart,tx
      )
      await Promise.all(
        order.cart.details.map(detail =>
        this.productService.discountStock(detail.product.product_id, detail.quantity, tx)
      )
    );
      await this.orderService.update(orderId,{
        orderId: orderId,
        status: OrderStatus.PAID,
      },tx)
      const payment = await this.paymentService.registerPayment(orderId, {
        orderId: orderId,
        amount: order.total,
        method: PaymentMethod.CASH,
        status: PaymentStatus.PAID
      }, tx)
      // await this.prisma.order.update({
      //   where: { order_id: orderId },
      //   data: {
      //     payment:{
      //       connect: {
      //         payment_id: payment.payment_id
      //       }
      //     }
      //   }
      // })
      return orderId
    })
    await this.sendOrderByEmail.execute(orderId);
    const html = (await this.generateHtml.execute(orderId));
    return html
  }
}