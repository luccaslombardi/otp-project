import './config/otp';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const loggerOptions = 
    process.env.NODE_ENV === 'production'
    ? { level:'info' }
    : {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname',
        }
      }
    };

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: loggerOptions }));

  const config = new DocumentBuilder()
    .setTitle('OTP Project')
    .setDescription('Projeto para geração e validação de OTP (TOTP/HOTP)')
    .setVersion('1.0')
    .addTag('otp') 
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

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0'); 
}
bootstrap();
