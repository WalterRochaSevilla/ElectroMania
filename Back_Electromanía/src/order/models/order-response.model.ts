import { CartResponseModel } from '../../cart/models/cart.model';

export interface OrderItemResponse {
    id: number;
    product_id: number;
    product_name: string;
    unit_price: number;
    quantity: number;
    total: number;
}

export class OrderResponseModel {
    order_id: number;
    uuid: string;
    total: number;
    status: string;
    created_at: string;
    items: OrderItemResponse[];
    cart?: CartResponseModel;
}