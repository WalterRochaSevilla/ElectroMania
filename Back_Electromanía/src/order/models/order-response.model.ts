import { CartResponseModel } from '../../cart/models/cart.model';
export class OrderResponseModel {
    uuid: string;
    total: number;
    status: string;
    createdAt: Date;
    CartResponseModel: CartResponseModel
}