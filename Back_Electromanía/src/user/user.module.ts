import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/service/prisma.service';

@Module({
    imports: [
        CommonModule
    ],
    controllers: [UserController],
    providers: [UserService,PrismaService],
    exports: [UserService]
})
export class UserModule {}
