import { Prisma } from "@prisma/client";
import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderResponseModel } from "../models/order-response.model";
import { CartMapper } from "../../cart/mapper/cart.mapper";
import { CartDetailsMapper } from '../../cart/mapper/cartDetails.mapper';
type OrderWithUserOrdersAndCart = Prisma.OrderGetPayload<{
        include: {
            userOrders: {
                include: {
                    user: true;
                };
            };
            cart: {
                include: {
                    cartDetails: {
                        include: {
                            product: true;
                        };
                    };
                };
            };
        };
    }>

export class OrderMapper {
    private readonly cartMapper = new CartMapper()
    private readonly cartDetailsMapper = new CartDetailsMapper()
    toRegisterEntity(CreateOrderSto:CreateOrderDto):Prisma.OrderCreateInput{
        const orderItems = CreateOrderSto.cart.details.map(detail => (this.cartDetailsMapper.toOrderItem(detail)))
       const response:Prisma.OrderCreateInput = {
           userOrders:{
            create:{
                user_uuid:CreateOrderSto.user_uuid
            }
           },
           cart:{
            connect:{
                cart_id:CreateOrderSto.cart.id,
            },
           },
           orderItems:{
            create:orderItems
           },
           total:CreateOrderSto.cart.total
       }
       return response
    }
    toResponseModel(entity:OrderWithUserOrdersAndCart):OrderResponseModel{
        const userOrder = entity.userOrders[0];
        const user = userOrder?.user;
        const response:OrderResponseModel = {
            id:entity.order_id,
            uuid:userOrder?.user_uuid || '',
            total:Number(entity.total),
            status:entity.status,
            createdAt:entity.created_at,
            cart: this.cartMapper.toOrderModel(entity.cart),
            user: user ? {
                uuid: user.uuid,
                name: user.name,
                email: user.email
            } : undefined
        }
        return response
    }
}