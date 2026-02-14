import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { CacheOrderKeys } from '../cache/cache-orders.keys';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class OrderService {
  logger = new Logger(OrderService.name);
  constructor(
    readonly prisma: PrismaService,
    readonly userService: UserService,
    readonly authService: AuthService,
    readonly cartService: CartService,
    readonly orderMapper: OrderMapper,
    @Inject(CACHE_MANAGER) private cacheManager:Cache
  ) {}
  async create(createOrderDto: Prisma.OrderCreateInput, tx?:Prisma.TransactionClient) {
    const prisma = tx ? tx : this.prisma;
    return await prisma.order.create({
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
    this.clearOrderCache(cart.userUUID);
    this.clearAllOrdersCache();
    const response = this.orderMapper.toResponseModel(order);
    this.cacheManager.set(CacheOrderKeys.orderByID(order.order_id), response, 8000);
    return response; 
  }

  async getByUser(userUuid: string):Promise<OrderResponseModel[]> {
    const cachedOrders = await this.getCachedOrdersByUser(userUuid);
    if(cachedOrders){
      return cachedOrders;
    }
    const orders = await this.prisma.order.findMany({
      where:{
        userOrders: {
          some:{
            user_uuid: userUuid
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
    const response = orders.map((o) => this.orderMapper.toResponseModel(o))
    this.cacheManager.set(CacheOrderKeys.orderByUser(userUuid), response, 8000);
    return response;
  }

  private clearOrderCache(userUuid:string){
    this.cacheManager.del(CacheOrderKeys.orderByUser(userUuid));
  }
  private clearCachedOrderById(orderId:number){
    this.cacheManager.del(CacheOrderKeys.orderByID(orderId));
  }
  private clearAllOrdersCache(){
    this.cacheManager.del(CacheOrderKeys.allOrders);
  }

  private async getAllCachedOrders():Promise<OrderResponseModel[] | null>{
    const cachedOrders = await this.cacheManager.get(CacheOrderKeys.allOrders);
    if(cachedOrders){
      return cachedOrders as OrderResponseModel[];
    }
    return null
  }
  private async getCahedOrderById(orderId:number):Promise<OrderResponseModel | null>{
    const cachedOrder = await this.cacheManager.get(CacheOrderKeys.orderByID(orderId));
    if(cachedOrder){
      return cachedOrder as OrderResponseModel;
    }
    return null
  }

  private async getCachedOrdersByUser(userUuid:string):Promise<OrderResponseModel[] | null>{
    const cachedOrders = await this.cacheManager.get(CacheOrderKeys.orderByUser(userUuid));
    if(cachedOrders){
      return cachedOrders as OrderResponseModel[];
    }
    return null
  }

  async getAll(){
    const cachedOrders = await this.getAllCachedOrders();
    if(cachedOrders){
      return cachedOrders;
    }
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
    
    const response = orders.map((o) => this.orderMapper.toResponseModel(o));
    this.cacheManager.set(CacheOrderKeys.allOrders, response, 8000);
    return response;
  }

  async getById(id: number) {
    const cachedOrder = await this.getCahedOrderById(id);
    if(cachedOrder){
      return cachedOrder;
    }
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
    const response = this.orderMapper.toResponseModel(order);
    this.cacheManager.set(CacheOrderKeys.orderByID(id), response, 8000);
    return response;
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
    const order = await prisma.order.update({
      where: { order_id: id },
      data: {
        status: updateOrderDto.status
      },
      include: {
        userOrders: true
      }
    })
    this.clearAllOrdersCache();
    this.clearOrderCache(order.userOrders[0].user_uuid);
    this.clearCachedOrderById(order.order_id);
    return order;
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
