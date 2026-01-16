import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserCreateRequestModel } from '../../user/models/UserCreateRequest.model';
import { UserLoginRequestModel } from '../models/user-login.model';
import { Email } from '../models/value objects/email';
import { UserMapper } from '../../user/mapper/User.mapper';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/service/prisma.service';
import { PasswordService } from '../../common/utils/password.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,UserMapper,UserService,JwtService,PrismaService,PasswordService,
        ConfigService
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Deberia registrar un usuario', () => {
      const request: UserCreateRequestModel = {
          name: 'prueba',
          email: 'prueba@gmail.com',
          password: 'password',
          nit_ci: '123456789',
          social_reason: 'prueba'
      }
      expect(service.registerUser(request)).toBeTruthy();
  }),
  it('Deberia iniciar sesion', () => {
      const request: UserLoginRequestModel = {
          email: 'prueba@gmail.com',
          password: 'password'
      }
      expect(service.login(request)).toBeTruthy();
  })
  it('Deberia generar un token valido', () => {
      const request: UserLoginRequestModel = {
          email: 'prueba@gmail.com',
          password: 'password'
      }
      const token = service.login(request);
      token.then((value) => {
          expect(service.validateToken(value.access_token)).toBeTruthy();
      })
  })
});
