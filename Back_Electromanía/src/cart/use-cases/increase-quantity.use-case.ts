import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { ProductService } from '../../product/service/product.service';
import { CartService } from "../service/cart.service";
import { UpdateCartDetailDto } from "../dto/update-cart-detail.dto";
import { PrismaService } from '../../prisma/service/prisma.service';
import { AuthService } from '../../auth/service/auth.service';
import { Prisma } from "@prisma/client";


@Injectable()
export class IncreaseQuantityUseCase{
  logger = new Logger('IncreaseQuantityUseCase')
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ){}
  async execute(uuid: string, request:UpdateCartDetailDto, tx?:Prisma.TransactionClient) {
    const prisma = tx? tx : this.prisma
      let activeCart = await this.cartService.getActiveCartByUser(uuid, tx);
      if(!activeCart) {
        activeCart = await this.cartService.createCart(uuid, tx);
      }
      this.logger.log("carro Activo");
      const product = await this.productService.getProductById(request.productId, tx);
      this.logger.log("producto:",product);
      if(!product){
        throw new ForbiddenException('Product not found');
      }
      const detail = await this.cartService.getCartDetailByCartAndProduct(activeCart.id, request.productId, tx);
      if(!detail){
        await this.cartService.createCartDetail(activeCart.id, request, tx);
      }else{
        await this.cartService.increaseQuantity(detail.id, request, tx);
      }
      await this.productService.reserveStock(request.productId, request.quantity, tx);
      
      return true
  }
}