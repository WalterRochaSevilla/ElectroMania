import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import Configuration from '../config/Configuration';
import { UserMapper } from 'src/user/mapper/User.mapper';

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
