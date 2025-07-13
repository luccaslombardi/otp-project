import { Controller, Post, Body } from '@nestjs/common';
import { GenerateTOTPService } from 'src/application/services/generate-totp.service';
import { GenerateTOTPDto } from './dto/generate-totp.dto';

@Controller('otp/totp')
export class GenerateTOTPController {
  constructor(private readonly generateTOTPService: GenerateTOTPService) {}

  @Post()
  async handle(@Body() body: GenerateTOTPDto) {
    const { userId } = body;
    const result = await this.generateTOTPService.execute(userId);
    return result;
  }
}
