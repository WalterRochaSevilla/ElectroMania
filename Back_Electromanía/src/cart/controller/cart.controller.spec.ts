import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from '../service/cart.service';
import { AuthGuard } from '../../auth/guards/auth.guard';

describe('CartController', () => {
  let controller: CartController;

  const mockCartService = {
    createCart: jest.fn(),
    getCartByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        { provide: CartService, useValue: mockCartService },
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
