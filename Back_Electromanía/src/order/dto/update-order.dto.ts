import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../models/order-response.model';
import { serialize } from 'class-transformer';

export class UpdateOrderDto{
  orderId: number
  status: OrderStatus
}
