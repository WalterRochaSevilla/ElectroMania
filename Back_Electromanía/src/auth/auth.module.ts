import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/service/prisma.service';

@Module({
  imports: [CommonModule,UserModule],
  controllers: [AuthController],
  providers: [AuthService,PrismaService],
})
export class AuthModule {}
