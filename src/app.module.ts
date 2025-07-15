import { Module } from '@nestjs/common';
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
  controllers: [],
  providers: [],
})
export class AppModule {}
