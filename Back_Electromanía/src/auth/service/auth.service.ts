import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { UserMapper } from 'src/user/mapper/User.mapper';
import { UserCreateRequestModel } from 'src/user/models/UserCreateRequest.model';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class AuthService {
    
    private readonly userMapper = new UserMapper();
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ) {}

    async registerUser(request: UserCreateRequestModel){
        try{
            return this.userService.registerUser(request);
        }catch(error){
            return Promise.reject(error);
        }
    }
}
