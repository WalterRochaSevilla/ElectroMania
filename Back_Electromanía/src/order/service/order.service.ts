import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { PrismaService } from '../../prisma/service/prisma.service';
import { AuthService } from '../../auth/service/auth.service';
import { CartService } from '../../cart/service/cart.service';
import { CartState, Order, Prisma } from '@prisma/client';
import { OrderMapper } from '../mapper/order.mapper';
import { CartResponseModel } from '../../cart/models/cart.model';
import { OrderResponseModel } from '../models/order-response.model';
import { UserService } from '../../user/service/user.service';
import { CartUpdateRequest } from '../../cart/models/CartUpdateRequest.model';

@Injectable()
export class OrderService {
  logger = new Logger(OrderService.name);
  constructor(
    readonly prisma: PrismaService,
    readonly userService: UserService,
    readonly authService: AuthService,
    readonly cartService: CartService,
    readonly orderMapper: OrderMapper
  ) {}
  create(createOrderDto: Prisma.OrderCreateInput, tx?:Prisma.TransactionClient) {
    const prisma = tx ? tx : this.prisma;
    return prisma.order.create({
      data: createOrderDto,
      include: {
        userOrders: {
          include: {
            user: true
          }
        },
        cart:{
          include: {
            cartDetails: {
              include: {
                product: true
              },
            },
          },
        }
      }
    });
  }

  async register(uuid: string,cart:CartResponseModel, tx?:Prisma.TransactionClient) {
    const request: CreateOrderDto = {
      user_uuid: cart.userUUID,
      cart: cart,
    };
    const order = await this.create(this.orderMapper.toRegisterEntity(request), tx);
    return this.orderMapper.toResponseModel(order);
  }

  async getByUser(token: string):Promise<OrderResponseModel[]> {
    const user = await this.authService.getUserFromToken(token);
    const orders = await this.prisma.order.findMany({
      where:{
        userOrders: {
          some:{
            user_uuid: user.uuid
          }
        },
      },
      include: {
        userOrders: {
          include: {
            user: true
          }
        },
        cart: {
          include:{
            cartDetails:{
              include: {
                product: true
              }
            }
          }
        }
      }
    });
    return orders.map((o) => this.orderMapper.toResponseModel(o));
  }

  async getAll(){
    const orders = await this.prisma.order.findMany({
      include: {
        userOrders: {
          include: {
            user: true
          }
        },
        cart: {
          include: {
            cartDetails: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });
    return orders.map((o) => this.orderMapper.toResponseModel(o));
  }

  async getById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { order_id: id },
      include: {
        userOrders: {
          include: {
            user: true
          }
        },
        cart: {
          include: {
            cartDetails: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.orderMapper.toResponseModel(order);
  }


  async getOrderForXML(id: number, tx?:Prisma.TransactionClient) {
    const prisma = tx? tx : this.prisma
    const order = await prisma.order.findUnique({
      where: { order_id: id },
      include: {
        orderItems: true,
        payment: {
          where: {
            order_id: id
          }
        },
        cart:{
          include:{
            user:{
              omit:{
                password: true
              }
            }
          }
        }
      }
    })
    if(!order){
      throw new NotFoundException('Order not found')
    }
    return this.orderMapper.toOrderReceiptModel(order)
  }

  async update(id: number, updateOrderDto: UpdateOrderDto,tx?:Prisma.TransactionClient) {
    const prisma = tx? tx : this.prisma
    return prisma.order.update({
      where: { order_id: id },
      data: {
        status: updateOrderDto.status
      }
    })
  }

  async saveOrderItems(cartResponseModel:CartResponseModel, orderId: number, tx?:Prisma.TransactionClient){
    const prisma = tx? tx : this.prisma
    cartResponseModel.details.map((detail) =>
      prisma.orderItem.create({
        data: {
          order_id: orderId,
          product_id: detail.product.product_id,
          product_name: detail.product.product_name,
          unit_price: detail.product.price,
          quantity: detail.quantity,
          total: detail.total,
        },
      }));
  }
  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
