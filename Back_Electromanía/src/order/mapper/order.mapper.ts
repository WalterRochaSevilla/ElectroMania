import { Prisma } from "@prisma/client";
import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderReceiptModel, OrderResponseModel } from "../models/order-response.model";
import { CartMapper } from "../../cart/mapper/cart.mapper";
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

type OrderForReceipt = Prisma.OrderGetPayload<{
    include: {
        orderItems: true,
        payment: true,
        cart: {
            include: {
                user: {
                    omit: {
                        password: true
                    }
                }
            }
        }
    };
}>
export class OrderMapper {
    private readonly cartMapper = new CartMapper()
    toRegisterEntity(CreateOrderSto:CreateOrderDto):Prisma.OrderCreateInput{
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
           total:CreateOrderSto.cart.total
       }
       return response
    }
    toResponseModel(entity:OrderWithUserOrdersAndCart):OrderResponseModel{
        const user = entity.userOrders[0].user
        const response:OrderResponseModel = {
            id:entity.order_id,
            user: {
                uuid:user.uuid,
                name:user.name,
                email:user.email
            },
            total:Number(entity.total),
            status:entity.status,
            createdAt:entity.created_at,
            cart: this.cartMapper.toOrderModel(entity.cart)
        }
        return response
    }
    toOrderReceiptModel(entity:OrderForReceipt):OrderReceiptModel{
        let orderStatus;
        switch(entity.status){
            case 'PENDING':
                orderStatus = 'Pendiente';
                break;
            case 'PAID':
                orderStatus = 'Pagado';
                break;
            case 'CANCELED':
                orderStatus = 'Cancelado';
                break;
            case "SHIPPED":
                orderStatus = 'Enviado';
                break;
            case "DELIVERED":
                orderStatus= 'Entregado';
                break;
        }
        let paymentMethod;
        let paymentStatus;
        if(entity.payment){
            switch(entity.payment.method){
                case 'CASH':
                    paymentMethod = 'Efectivo';
                    break;
            }
            switch(entity.payment.status){
                case 'PENDING':
                    paymentStatus = 'Pendiente';
                    break;
                case 'PAID':
                    paymentStatus = 'Pagado';
                    break;
                case 'CANCELED':
                    paymentStatus = 'Cancelado';
                    break;
            }
        }
        const response:OrderReceiptModel = {
            order_id:entity.order_id,
            status: {
                translate: orderStatus,
                value: entity.status
            },
            total: Number(entity.total),
            created_at: entity.created_at.toISOString(),
            user: {
                uuid:entity.cart.user.uuid,
                name:entity.cart.user.name,
                email:entity.cart.user.email,
                phone_number:entity.cart.user.phone_number,
                nit_ci:entity.cart.user.nit_ci,
                social_reason:entity.cart.user.social_reason
            },
            orderItems: entity.orderItems,
            payment: entity.payment ? {
                method: {
                    translate: paymentMethod,
                    value: entity.payment.method
                },
                status: {
                    translate: paymentStatus,
                    value: entity.payment.status
                },
                amount: Number(entity.payment.amount)
            } : null
        }
        return response
    }
}