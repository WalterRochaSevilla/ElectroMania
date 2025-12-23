import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserCreateRequestModel } from 'src/user/models/UserCreateRequest.model';
import { UserLoginRequestModel } from '../models/user-login.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body()request: UserCreateRequestModel) {
    return this.authService.registerUser(request);
  }

  @Post('login')
  async login(@Body() request: UserLoginRequestModel) {
    return this.authService.login(request);
  }
}
