import { Module } from '@nestjs/common';
import { GenerateTOTPController } from './interfaces/controllers/totp/generate-totp.controller';
import { ValidateTOTPController } from './interfaces/controllers/totp/validate-totp.controller';
import { GenerateTOTPService } from './application/services/totp/generate-totp.service';
import { ValidateTOTPService } from './application/services/totp/validate-totp.service';
import { GenerateHOTPController } from './interfaces/controllers/hotp/generate-hotp.controller';
import { GenerateHOTPService } from './application/services/hotp/generate-hotp.service';
import { ValidateHOTPController } from './interfaces/controllers/hotp/validate-hotp.controller';
import { ValidateHOTPService } from './application/services/hotp/validate-hotp.service';

@Module({
  controllers: [
    //TOTP
    GenerateTOTPController, 
    ValidateTOTPController,
    //HOTP
    GenerateHOTPController,
    ValidateHOTPController,
  ],
  providers: [
    //TOTP
    GenerateTOTPService, 
    ValidateTOTPService,
    //HOTO
    GenerateHOTPService,
    ValidateHOTPService
  ],
})
export class OtpModule {}
