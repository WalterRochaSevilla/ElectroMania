import { Injectable } from "@nestjs/common";
import { CartService } from '../service/cart.service';


@Injectable()
export class CreateCartUseCase {
  constructor(
    private readonly CartService: CartService
  ) { }

  execute(token: string) {
    return this.CartService.createCart(token);
  }
}