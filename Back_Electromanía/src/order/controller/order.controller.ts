import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards, Logger, Query, ParseIntPipe, Res } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CreateOrderByCartUseCase } from '../use-cases/create-order-by-cart.usecase';
import { AuthService } from '../../auth/service/auth.service';
import { ConfirmPaymentForOrderUseCase } from '../use-cases/confirm-payment-for-order.use-case';
import { UpdateOrderStatusUseCase } from '../use-cases/update-order-status.use-case';
import { GenerateOrderXmlUseCase } from '../use-cases/generate-order-xml.usecase';
import { Response } from 'express';
import { SendOrderReceiptUseCase } from '../use-cases/send-order-receipt.use-case';

@Controller('order')
export class OrderController {
  logger = new Logger('OrderController')
  constructor(private readonly orderService: OrderService,
    private readonly authService: AuthService,
    private readonly createOrderByCart:CreateOrderByCartUseCase,
    private readonly confirmPayment:ConfirmPaymentForOrderUseCase,
    private readonly updateOrderStatus:UpdateOrderStatusUseCase,
    private readonly generateXml:GenerateOrderXmlUseCase,
    private readonly sendMail:SendOrderReceiptUseCase
  ) {}

  @UseGuards(AuthGuard)
  @Post('register')
  async register(@Headers('authorization') token: string) {
    const user = await  this.authService.getUserFromToken(token.replace('Bearer ', ''));
    return this.createOrderByCart.execute(user.uuid);
  }
  @Get("all")
  async getAllOrders() {
    return this.orderService.getAll();
  }
  @Get('receipt')
  async getOrderReceipt(
    @Query('id', ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    this.logger.log("Generating receipt for order:", id);
    const result = await this.generateXml.execute(id);
    
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(result.html);
  }
  @Post('receipt/send')
  async sendOrderReceipt(@Query('id', ParseIntPipe) id: number) {
    this.logger.log('Sending receipt email for order:', id);
    return this.sendMail.execute(id);
  }
  @UseGuards(AuthGuard)
  @Get()
  async getAllOrdersBy(@Headers('authorization') token: string) {
    return this.orderService.getByUser(token.replace('Bearer ', ''));
  }

  @Get(':id')
  async pay(@Param('id') id: string,
  @Res() res: Response
) {
    const result = await this.confirmPayment.execute(Number(id));
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(result.html);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    this.logger.log("id:",id);
    this.logger.log("updateOrderDto:",updateOrderDto);
    return this.updateOrderStatus.execute(id, updateOrderDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
