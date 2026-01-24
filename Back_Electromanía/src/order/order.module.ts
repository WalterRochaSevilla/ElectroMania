import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PrismaService } from '../prisma/service/prisma.service';
import { CartService } from '../cart/service/cart.service';
import { OrderMapper } from './mapper/order.mapper';
import { CartMapper } from '../cart/mapper/cart.mapper';


@Module({
  imports: [ProductModule, UserModule,AuthModule],
  controllers: [OrderController],
  providers: [OrderService,RolesGuard,AuthGuard,PrismaService,CartService,OrderMapper,CartMapper],
})
export class OrderModule {}
