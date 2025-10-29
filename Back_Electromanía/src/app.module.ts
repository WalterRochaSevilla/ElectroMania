import { PasswordService } from './common/utils/password.service';
import { CommonModule } from './common/common.module';
import { UserController } from './user/controller/user.controller';
import { UserService } from './user/service/user.service';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import Configuration from './config/Configuration';

@Module({
  imports: [
        CommonModule, 
        UserModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config = Configuration) => ({
<<<<<<< HEAD
        type: 'mysql',
=======
        type: config().database.type,
>>>>>>> parent of d53a59b (Migration: Migrates Db to postgress and prisma)
        host: config().database.host,
        port: config().database.port,
        username: config().database.username,
        password: config().database.password,
        database: config().database.name,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
<<<<<<< HEAD
        synchronize: true,
=======
        synchronize: config().database.syncronize,
>>>>>>> parent of d53a59b (Migration: Migrates Db to postgress and prisma)
        autoLoadEntities: true
      }),
    }),
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
