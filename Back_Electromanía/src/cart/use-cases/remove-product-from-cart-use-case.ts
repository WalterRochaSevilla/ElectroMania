import { ForbiddenException, Injectable } from "@nestjs/common";
import { CartService } from "../service/cart.service";
import { ProductService } from '../../product/service/product.service';
import { Prisma } from "@prisma/client";
import { UpdateCartDetailDto } from "../dto/update-cart-detail.dto";
import { DeleteProductFromCartDto } from "../dto/delete-product-from-cart.dto";
import { GetActiveCartUseCase } from "./get-active-cart.use-case";

@Injectable()
export class RemoveProductFromCartUseCase {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly getActiveCartUseCase: GetActiveCartUseCase
  ) {}

  async execute(userUuid:string,request:DeleteProductFromCartDto,tx?:Prisma.TransactionClient) {
    let activeCart = await this.getActiveCartUseCase.execute(userUuid,tx);
    if(!activeCart) {
      activeCart = await this.cartService.createCart(userUuid, tx);
    }
    const detail = await this.cartService.getCartDetailByCartAndProduct(activeCart.id, request.productId, tx);
    if(!detail){
      throw new ForbiddenException('Product not found in cart');
    }
    await this.productService.addStock(
      request.productId,
      detail.quantity,
      tx
    )
    return this.cartService.deleteCartDetailById(detail.id,tx);
  }
}