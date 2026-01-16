import { ProductModel } from '../../product/model/Product.model';
import { CartProductModel } from './CardProduct.model';
export class CartDetailsResponseModel {
    product: CartProductModel
    quantity: number
    total: number
}