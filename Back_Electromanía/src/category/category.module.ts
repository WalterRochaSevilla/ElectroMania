import { Module } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CategoryController } from './controller/category.controller';
import { PrismaService } from '../prisma/service/prisma.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CategoryMapper } from './mapper/category.mapper';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService,PrismaService,AuthGuard,RolesGuard,CategoryMapper],
})
export class CategoryModule {}
