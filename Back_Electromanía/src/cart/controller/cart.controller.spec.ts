import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { UserMapper } from '../../user/mapper/User.mapper';
import { UserService } from '../../user/service/user.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { AuthService } from '../../auth/service/auth.service';

describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [UserMapper,UserService,PrismaService,AuthService],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
