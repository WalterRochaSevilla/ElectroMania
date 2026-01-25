import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../prisma/service/prisma.service';
import { AuthService } from '../../auth/service/auth.service';
import { ProductService } from '../../product/service/product.service';
import { AddProductToCartRequestDto } from "../dto/addProductToCartRequest.dto";
import { CartService } from '../service/cart.service';


@Injectable()
export class AddProductToCartUseCase {
  constructor(
    private readonly prisma:PrismaService,
    private readonly authService: AuthService,
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}
  async execute(
    token: string,
    addProductRequest:AddProductToCartRequestDto
  ){
    const toKenFormat = token.replace("Bearer ", "");
    const user = await this.authService.getUserFromToken(toKenFormat);
    return this.prisma.$transaction(async (tx) => {
      let activeCart = await tx.cart.findFirst({
        where: {
          user_uuid: user.uuid,
          state: "ACTIVE",
        }
      })
      if(!activeCart) {
        activeCart = await this.cartService.createCart(toKenFormat, tx);
      }
      const product = await this.productService.getProductById(addProductRequest.productId, tx);
      await this.productService.discountStock(addProductRequest.productId, addProductRequest.quantity, tx);
      return this.cartService.checkCartDetail(activeCart.cart_id, addProductRequest, tx);
    })
  }
}