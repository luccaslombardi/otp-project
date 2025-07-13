import { Controller, Post, Body } from '@nestjs/common';
import { GenerateTOTPService } from 'src/application/services/generate-totp.service';

@Controller('otp/totp')
export class GenerateTOTPController {
  constructor(private readonly generateTOTPService: GenerateTOTPService) {}

  @Post()
  async handle(@Body('userId') userId: string) {
    const result = await this.generateTOTPService.execute(userId);
    return result;
  }
}
