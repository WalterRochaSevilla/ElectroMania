import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../prisma/service/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import Configuration from '../config/Configuration';
import { UserMapper } from '../user/mapper/User.mapper';
import { PasswordService } from '../common/utils/password.service';
import { LoginUseCase } from './use-cases/login.usecase';
import { UserService } from '../user/service/user.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CommonModule,
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtConstants.secret'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UserMapper,
    PasswordService,
    LoginUseCase,
    UserService,
  ],
  exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
