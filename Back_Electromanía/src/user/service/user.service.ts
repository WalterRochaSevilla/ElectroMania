import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { PasswordService } from 'src/common/utils/password.service';
import { UserCreateRequestModel } from '../models/UserCreateRequest.model';
import { UserMapper } from '../mapper/User.mapper';
import { UserModel } from '../models/User.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly userMapper = new UserMapper();

  constructor(
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

  async registerUser(user: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data: user });
  }

  async createUser(user: UserCreateRequestModel) {
    const hashedPassword = await this.passwordService.hashPassword(user.password);
    user.password = hashedPassword;

    const entity = this.userMapper.toEntity(user);
    return this.registerUser(entity);
  }

  async filterBy(filter: Prisma.UserWhereInput) {
    return this.prisma.user.findMany({ where: filter });
  }
}
