import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpModule } from './otp.module';
import { ConfigModule } from '@nestjs/config';
import { dynamoProvider } from './infraestructure/external/aws/dynamo.provider';
import { DynamoUserOtpRepository } from './infraestructure/repositories/dynamo-user-otp.repository';

@Module({
  imports: [
    ConfigModule.forRoot ({
      isGlobal: true,
      envFilePath: '.env.development.local'
    }),
    OtpModule],
  controllers: [AppController],
  providers: [
    AppService, 
    dynamoProvider, {
    provide: 'UserOtpRepository',
    useClass: DynamoUserOtpRepository
  }],
  exports: [dynamoProvider, 'UserOtpRepository']
})
export class AppModule {}
