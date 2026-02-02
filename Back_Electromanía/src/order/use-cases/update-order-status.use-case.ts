import { Injectable } from "@nestjs/common";
import { ConfirmPaymentForOrderUseCase } from "./confirm-payment-for-order.use-case";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { OrderStatus } from "../models/order-response.model";
import { CancelOrderUseCase } from './cancel-order.use-case';


@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    private readonly confirmPayment:ConfirmPaymentForOrderUseCase,
    private readonly cancelOrder:CancelOrderUseCase
  ) {}
  async execute(orderId:number, updateOrderDto:UpdateOrderDto){
    if(updateOrderDto.status === OrderStatus.PAID){
      await this.confirmPayment.execute(orderId);
    }else if(updateOrderDto.status === OrderStatus.CANCELED){
      await this.cancelOrder.execute(orderId);
    }
  }
}