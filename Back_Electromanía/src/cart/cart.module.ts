import { Module, UseGuards } from '@nestjs/common';
import { CartController } from './controller/cart.controller';
import { CartService } from './service/cart.service';
import { PrismaService } from '../prisma/service/prisma.service';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CartMapper } from './mapper/cart.mapper';

@Module({
    imports: [ProductModule, UserModule,AuthModule],
    controllers: [CartController],
    providers: [CartService, RolesGuard,AuthGuard,PrismaService,CartMapper,]
})
export class CartModule {}
