import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Configuration from './config/Configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { apiReference } from '@scalar/nestjs-api-reference';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads'))
  );
  const config = new DocumentBuilder()
  .setTitle('Electromania')
  .setDescription('API de Compra y Venta de Productos Electrónicos')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'JWT',
  )
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)
  app.use(
    '/docs',
    apiReference({
      content: document,
    })
  );
  app.enableCors({
    origin: Configuration().webSiteDomain.url,
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
