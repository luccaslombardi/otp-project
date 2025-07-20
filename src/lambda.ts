import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './module/app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import awsLambdaFastify from '@fastify/aws-lambda';
import { loggerOptions } from './config/logger';

let cachedHandler: any;

async function bootstrap() {

  const adapter = new FastifyAdapter({ logger: loggerOptions });
  const app = await NestFactory.create(AppModule, adapter);

  const config = new DocumentBuilder()
    .setTitle('OTP Project')
    .setDescription('Projeto para geração e validação de OTP')
    .setVersion('1.0')
    .addTag('otp')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Informe o token JWT no formato: Bearer <token>',
      in: 'header',
    },
    'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  const instance = app.getHttpAdapter().getInstance();
  return awsLambdaFastify(instance);

}

export const handler = async (event: any, context: any) => {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }

  return cachedHandler(event, context);
};
