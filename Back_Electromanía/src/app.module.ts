import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
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
        type: 'mysql',
        host: config().database.host,
        port: config().database.port,
        username: config().database.username,
        password: config().database.password,
        database: config().database.name,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true
      }),
    }),
    ProductModule
  ],
  controllers: [AppController],
  providers: [
         AppService],
})
export class AppModule {}
