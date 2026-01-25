import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../prisma/service/prisma.service';
import { AuthService } from '../../auth/service/auth.service';
import { ProductService } from '../../product/service/product.service';
import { CartService } from "../service/cart.service";
import { UpdateCartDetailDto } from "../dto/update-cart-detail.dto";

@Injectable()
export class UpdateProductQuantityUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}
  async execute(token: string, request:UpdateCartDetailDto) {
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
      return this.cartService.checkUpdateCartDetail(activeCart.cart_id, request, tx);
    })
  }
}