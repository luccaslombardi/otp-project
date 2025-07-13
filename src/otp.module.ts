import { Module } from '@nestjs/common';
import { GenerateTOTPController } from './interfaces/controllers/generate-totp.controller';
import { GenerateTOTPService } from './application/services/generate-totp.service';

@Module({
  controllers: [GenerateTOTPController],
  providers: [GenerateTOTPService],
})
export class OtpModule {}
