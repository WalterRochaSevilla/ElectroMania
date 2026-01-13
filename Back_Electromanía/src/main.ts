import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Configuration from './config/Configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: Configuration().webSiteDomain.url
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
