import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { PasswordService } from '../../common/utils/password.service';
import { UserCreateRequestModel } from '../models/UserCreateRequest.model';
import { UserMapper } from '../mapper/User.mapper';
import { UserModel } from '../models/User.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(
    private readonly userMapper: UserMapper,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}
  async findAll() {
    return this.prisma.user.findMany();
  }

  async getAllUsers(): Promise<UserModel[]> {
    const users = await this.findAll();
    return users.map((u) => this.userMapper.toModel(u));
  }

  async createUser(user: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data: user });
  }

  async registerUser(user: UserCreateRequestModel) {
    try{
      const hashedPassword = await this.passwordService.hashPassword(user.password);
      user.password = hashedPassword;
      const entity = this.userMapper.toEntity(user);
      const result = await this.createUser(entity);
      return this.userMapper.toRegisterUserModel(result);
    }catch(error){
      if(error.code === 'P2002'){
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  async getUserByField(field: string, value: string) {
    return this.prisma.user.findFirst({ where: { [field]: value } });
  }

  async userExistByField(field: string, value: string) {
    return this.prisma.user.findFirst({ where: { [field]: value } }) !== null;
  }

  async filterBy(filter: Prisma.UserWhereInput) {
    return this.prisma.user.findMany({ where: filter });
  }
}
