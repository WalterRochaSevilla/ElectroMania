import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../common/utils/password.service';
import { UserMapper } from '../../user/mapper/User.mapper';
import { PrismaService } from '../../prisma/service/prisma.service';
import { UserCreateRequestModel } from '../../user/models/UserCreateRequest.model';
import { UserLoginRequestModel } from '../models/user-login.model';
import { LoginResponseModel } from '../models/login-response.model';
import { UserJwtPayloadModel } from '../models/user-jwt-payload.model';
import { UserRole } from '../../user/enums/UserRole.enum';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let passwordService: PasswordService;
  let userMapper: UserMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserMapper,
          useValue: {
            toJwtPayloadModel: jest.fn((user) => new UserJwtPayloadModel(user.uuid, user.email, user.role)),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            registerUser: jest.fn(),
            registerAdminUser: jest.fn(),
            getUserByField: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn((password: string) => `hashed-${password}`),
            comparePassword: jest.fn((password: string, hash: string) => password === hash)
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'jwt-token'),
            verify: jest.fn((token: string) => ({ user: { uuid: '123', email: 'test@gmail.com', role: UserRole.USER } })),
            decode: jest.fn((token: string) => ({ user: { uuid: '123', email: 'test@gmail.com', role: UserRole.USER } })),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    passwordService = module.get<PasswordService>(PasswordService);
    userMapper = module.get<UserMapper>(UserMapper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Deberia registrar un usuario', async () => {
    const request: UserCreateRequestModel = {
      name: 'pruebas',
      email: 'pruebas@gmail.com',
      password: 'Password#3101#',
      nit_ci: '1234567121',
      social_reason: 'pruebas',
      phone: '1234567121',
    };

    (userService.registerUser as jest.Mock).mockResolvedValue({
      id: 1,
      ...request,
      password: `hashed-${request.password}`,
    });

    const result = await service.registerUser(request);
    expect(result).toBeTruthy();
    expect(userService.registerUser).toHaveBeenCalledWith(request);
  });

  it('Deberia iniciar sesion correctamente', async () => {
    const request: UserLoginRequestModel = {
      email: 'pruebas@gmail.com',
      password: 'Password#3101#',
    };

    const mockUser = {
      uuid: '123',
      email: request.email,
      password: 'Password#3101#',
      role: UserRole.USER,
    };

    (userService.getUserByField as jest.Mock).mockResolvedValue(mockUser);

    const result: LoginResponseModel = await service.login(request);

    expect(result).toBeTruthy();
    expect(result.access_token).toBe('jwt-token');
    expect(userService.getUserByField).toHaveBeenCalledWith('email', request.email);
  });

  it('Deberia lanzar UnauthorizedException si el usuario no existe', async () => {
    (userService.getUserByField as jest.Mock).mockResolvedValue(null);

    await expect(service.login({ email: 'noexiste@gmail.com', password: 'Password#3101#' }))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('Deberia lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
    const mockUser = {
      uuid: '123',
      email: 'pruebas@gmail.com',
      password: 'wrong-password',
      role: UserRole.USER,
    };

    (userService.getUserByField as jest.Mock).mockResolvedValue(mockUser);

    await expect(service.login({ email: 'pruebas@gmail.com', password: 'Password#3101#' }))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('Deberia generar y validar un token', async () => {
    const payload = new UserJwtPayloadModel('123', 'test@gmail.com', UserRole.USER);

    const token: LoginResponseModel = await service['generateToken'](payload);

    expect(token.access_token).toBe('jwt-token');

    const decoded = await service.validateToken(token.access_token);
    expect(decoded).toEqual({ user: { uuid: '123', email: 'test@gmail.com', role: UserRole.USER } });
  });

  it('Deberia obtener user del token', async () => {
    const token = 'fake-token';
    const user = await service.getUserFromToken(token);
    expect(user).toEqual({ uuid: '123', email: 'test@gmail.com', role: UserRole.USER });
  });

});
