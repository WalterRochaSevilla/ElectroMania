import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserCreateRequestModel } from '../../user/models/UserCreateRequest.model';
import { UserLoginRequestModel } from '../models/user-login.model';
import { ApiFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserModel } from '../../user/models/User.model';
import { UserJwtPayloadModel } from '../models/user-jwt-payload.model';
import { access } from 'fs';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Registrar un nuevo usuario ',
    description: 'Registrar un nuevo usuario',
    tags: ['auth'],
    operationId: 'registerUser',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserCreateRequestModel',
          },
          example: {
            name: 'prueba',
            email: 'prueba@gmail',
            password: 'password',
            nit_ci: '123456789',
            social_reason: 'prueba'
          }
        },
      },
    }
  })
  @ApiOkResponse({
    description: 'Usuario registrado',
    type: UserModel,
    example: {
      uuid: 'uuid',
      name: 'prueba',
      email: 'prueba@gmail',
      nit_ci: '123456789',
      social_reason: 'prueba'
    }
  })
  @ApiFoundResponse({
    description: 'El usuario ya existe',
    type: String,
    example: 'El usuario ya existe'
  })
  @Post('register')
  async registerUser(@Body()request: UserCreateRequestModel) {
    return this.authService.registerUser(request);
  }

  @ApiOperation({
    summary: 'Iniciar sesion',
    description: 'Iniciar sesion',
    tags: ['auth'],
    operationId: 'login',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserLoginRequestModel',
          },
          example: {
            email: 'prueba@gmail',
            password: 'password',
          }
        },
      },
    }
  })
  @ApiOkResponse({
    description: 'Token de acceso del usuario',
    type: UserJwtPayloadModel,
    example: {
      access_token: '2ef2sdfkmsdsdflnsfdmlmsldflsdfmlkmsdfmlsdflnslfmlsdkmflkmdslfmksmlfkdmskl'
    }
  })
  @Post('login')
  async login(@Body() request: UserLoginRequestModel) {
    return this.authService.login(request);
    
  }
  @Post('register-admin')
  async registerAdminUser(@Body() request: UserCreateRequestModel) {
    return this.authService.registerAdminUser(request);
  }
}
