import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from '../service/cart.service';
import { AddProductToCartUseCase } from '../use-cases/add-product-to-cart.use-case';
import { UpdateProductQuantityUseCase } from '../use-cases/update-product-quantity.use-case';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AuthModule } from '../../auth/auth.module';
import { GetActiveCartUseCase } from '../use-cases/get-active-cart.use-case';
import { IncreaseQuantityUseCase } from '../use-cases/increase-quantity.use-case';
import { DecreaseQuantityUseCase } from '../use-cases/decrease-quantity.use-case';
import { RemoveProductFromCartUseCase} from '../use-cases/remove-product-from-cart-use-case';
import { exec } from 'child_process';
import { AuthService } from '../../auth/service/auth.service';

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
          }
        },{
          provide: GetActiveCartUseCase,
          useValue: {
            execute: jest.fn(),
          }
        },{
          provide: IncreaseQuantityUseCase,
          useValue: {
            execute: jest.fn(),
          }
        },{
            provide: DecreaseQuantityUseCase,
            useValue: {
              execute: jest.fn(),
            },
          },{
            provide: RemoveProductFromCartUseCase,
            useValue: {
              execute: jest.fn(),
            },
          },
          {
            provide: AuthService,
            useValue: {
              getUserFromToken: jest.fn(),
            },
          }
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
