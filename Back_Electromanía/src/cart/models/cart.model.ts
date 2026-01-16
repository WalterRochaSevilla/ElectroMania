import { ProductModel } from "src/product/model/Product.model";
import { CartDetailsResponseModel } from './cartDetails.model';

export class CartResponseModel{
    id: number;
    userUUID: string;
    details: CartDetailsResponseModel[];
    total: number;
}