import { CartResponseModel } from '../../cart/models/cart.model';

export interface OrderUserInfo {
    uuid: string;
    name: string;
    email: string;
}

export class OrderResponseModel {
    id: number;
    uuid: string;
    total: number;
    status: string;
    createdAt: Date;
    cart: CartResponseModel;
    user?: OrderUserInfo;
}