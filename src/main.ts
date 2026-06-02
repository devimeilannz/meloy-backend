import { ValidationPipe }
from '@nestjs/common';

import { NestFactory }
from '@nestjs/core';

import { AppModule }
from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Meiloy API')
    .setDescription('Dokumentasi API')
    .setVersion('1.0')
    // .addServer(process.env.BASE_URL || 'http://localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  console.log(`Swagger running at /api`);
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();