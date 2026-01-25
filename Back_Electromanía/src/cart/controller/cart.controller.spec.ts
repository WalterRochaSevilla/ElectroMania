import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from '../service/cart.service';
import { AddProductToCartUseCase } from '../use-cases/add-product-to-cart.use-case';
import { UpdateProductQuantityUseCase } from '../use-cases/update-product-quantity.use-case';
import { AuthGuard } from '../../auth/guards/auth.guard';

describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            createCart: jest.fn(),
            getCartByUser: jest.fn(),
            deleteCartDetail: jest.fn(),
          },
        },
        {
          provide: AddProductToCartUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateProductQuantityUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
