import { CartResponseModel } from '../../cart/models/cart.model';
export class OrderResponseModel {
    id: number;
    uuid: string;
    total: number;
    status: string;
    createdAt: Date;
    cart: CartResponseModel
}