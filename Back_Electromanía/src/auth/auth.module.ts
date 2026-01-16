import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../prisma/service/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import Configuration from '../config/Configuration';
import { UserMapper } from '../user/mapper/User.mapper';

@Module({
  imports: [
    CommonModule,UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: Configuration().jwtConstants.secret,
      signOptions: { expiresIn: "24h" },
      global: true
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,PrismaService, UserMapper],
  exports: [PassportModule, JwtModule, AuthService]
})
export class AuthModule {}
