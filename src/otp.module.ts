import { Module } from '@nestjs/common';
import { GenerateTOTPController } from './interfaces/controllers/generate-totp.controller';
import { ValidateTOTPController } from './interfaces/controllers/validate-totp.controller';
import { GenerateTOTPService } from './application/services/generate-totp.service';
import { ValidateTOTPService } from './application/services/validate-totp.service';

@Module({
  controllers: [GenerateTOTPController, ValidateTOTPController],
  providers: [GenerateTOTPService, ValidateTOTPService],
})
export class OtpModule {}
