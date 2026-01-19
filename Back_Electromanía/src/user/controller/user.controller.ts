import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserCreateRequestModel } from '../models/UserCreateRequest.model';
import { UserModel } from '../models/User.model';
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService){}
    @Get("all")
    async getAllUsers(): Promise<UserModel[]> {
        return await this.userService.getAllUsers();
    }
    @Get("get")
    async getUserByUUID(@Headers('authorization') token: string): Promise<UserModel> {
        return await this.userService.getUserByUUID(token.replace("Bearer ", ""));
    }
}
