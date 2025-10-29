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
    ProductModule
  ],
  controllers: [AppController],
  providers: [
         AppService],
})
export class AppModule {}
