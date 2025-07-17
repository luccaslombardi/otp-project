import { Module } from '@nestjs/common';
import { GenerateTOTPController } from '../interfaces/controllers/totp/generate-totp.controller';
import { ValidateTOTPController } from '../interfaces/controllers/totp/validate-totp.controller';
import { GenerateHOTPController } from '../interfaces/controllers/hotp/generate-hotp.controller';
import { ValidateHOTPController } from '../interfaces/controllers/hotp/validate-hotp.controller';
import { GenerateTOTPService } from '../application/services/totp/generate-totp.service';
import { ValidateTOTPService } from '../application/services/totp/validate-totp.service';
import { GenerateHOTPService } from '../application/services/hotp/generate-hotp.service';
import { ValidateHOTPService } from '../application/services/hotp/validate-hotp.service';
import { GetUserOtpService } from '../application/services/get-user-otp.service';
import { AuthModule } from './auth.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [
    //TOTP
    GenerateTOTPController, 
    ValidateTOTPController,
    //HOTP
    GenerateHOTPController,
    ValidateHOTPController,
  ],
  providers: [
    GetUserOtpService,
    //TOTP
    GenerateTOTPService, 
    ValidateTOTPService,
    //HOTO
    GenerateHOTPService,
    ValidateHOTPService
  ],
  exports: [
    GetUserOtpService,
    GenerateTOTPService,
    ValidateTOTPService,
    GenerateHOTPService,
    ValidateHOTPService,
  ]
})
export class OtpModule {}
