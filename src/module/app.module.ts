import { Module } from '@nestjs/common';
import { OtpModule } from './otp.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    ConfigModule.forRoot ({
      isGlobal: true,
      envFilePath: '.env'
    }),
    OtpModule,
    DatabaseModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
