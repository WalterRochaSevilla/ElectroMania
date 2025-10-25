import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User.entity';
import { Repository } from 'typeorm';
import { PasswordService } from 'src/common/utils/password.service';
import { UserCreateRequestModel } from '../models/UserCreateRequest.model';
import { UserMapper } from '../mapper/User.mapper';
import { UserModel } from '../models/User.model';

@Injectable()
export class UserService {
    userMapper = new UserMapper();
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly passwordService: PasswordService
    ){
    }

    async findAll(): Promise<User[]>{
        return await this.userRepository.find();
    }

    async getAllUsers(): Promise<UserModel[]>{
        const users = await this.findAll();
        return users.map(user => this.userMapper.toModel(user));
    }
    
    async registerUser(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async createUser(user: UserCreateRequestModel): Promise<User> {
        const password = await this.passwordService.hashPassword(user.password);
        user.password = password;
        return this.registerUser(this.userMapper.toEntity(user));
    }

    async filterBy(filter: any): Promise<User[]>{
        return await this.userRepository.find(filter);
    }
}
