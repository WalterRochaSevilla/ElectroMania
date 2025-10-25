import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserCreateRequestModel } from '../models/UserCreateRequest.model';
import { UserModel } from '../models/User.model';
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post("register")
    async registerUser(@Body() user: UserCreateRequestModel): Promise<UserModel> {
        return await this.userService.createUser(user);
    }

    @Get("all")
    async getAllUsers(): Promise<UserModel[]> {
        return await this.userService.getAllUsers();
    }
}
