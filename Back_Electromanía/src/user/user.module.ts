import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]),CommonModule],
    controllers: [UserController],
    providers: [UserService,],
})
export class UserModule {}
