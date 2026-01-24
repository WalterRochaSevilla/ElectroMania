import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post('register')
  register(@Headers('authorization') token: string) {
    return this.orderService.register(token.replace('Bearer ', ''));
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllOrdersBy(@Headers('authorization') token: string) {
    return this.orderService.getByUser(token.replace('Bearer ', ''));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
