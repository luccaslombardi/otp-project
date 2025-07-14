import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpModule } from './otp.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ConfigModule.forRoot ({
      isGlobal: true,
      envFilePath: '.env.development.local'
    }),
    OtpModule,
    DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
