import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpModule } from './otp.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot ({
      isGlobal: true,
      envFilePath: '.env.development.local'
    }),
    OtpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
