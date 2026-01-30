import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CreateOrderByCartUseCase } from '../use-cases/create-order-by-cart.usecase';
import { AuthService } from '../../auth/service/auth.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService,
    private readonly authService: AuthService,
    private readonly createOrderByCart:CreateOrderByCartUseCase
  ) {}

  @UseGuards(AuthGuard)
  @Post('register')
  async register(@Headers('authorization') token: string) {
    const user = await  this.authService.getUserFromToken(token.replace('Bearer ', ''));
    return this.createOrderByCart.execute(user.uuid);
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
