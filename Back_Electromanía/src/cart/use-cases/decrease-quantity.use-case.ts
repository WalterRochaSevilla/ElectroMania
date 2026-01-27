import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../../prisma/service/prisma.service';
import { AuthService } from '../../auth/service/auth.service';
import { ProductService } from '../../product/service/product.service';
import { CartService } from "../service/cart.service";
import { UpdateCartDetailDto } from "../dto/update-cart-detail.dto";
import { RemoveProductFromCartUseCase } from './remove-product-from-cart-use-case';
import { Prisma } from "@prisma/client";

@Injectable()
export class DecreaseQuantityUseCase {
  constructor(
      private readonly prisma: PrismaService,
      private readonly authService: AuthService,
      private readonly productService: ProductService,
      private readonly cartService: CartService,
      private readonly removeProductFromCartUseCase: RemoveProductFromCartUseCase
    ){}
    async execute(uuid: string, request:UpdateCartDetailDto, tx?:Prisma.TransactionClient) {
      const prisma = tx? tx : this.prisma
        let activeCart = await this.cartService.getActiveCartByUser(uuid, tx);
              if(!activeCart) {
                activeCart = await this.cartService.createCart(uuid, tx);
              }
              const detail = await this.cartService.getCartDetailByCartAndProduct(activeCart.id, request.productId, tx);
              if(!detail){
                throw new ForbiddenException('Product not found in cart');
              }else{
                if(detail.quantity < request.quantity){
                  return this.removeProductFromCartUseCase.execute(uuid, request, tx);
                }
                await this.cartService.decreaseQuantity(detail.id, request, tx);
              }
              await this.productService.addStock(request.productId, request.quantity, tx);
              return true
    }
}