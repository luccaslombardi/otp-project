// src/interfaces/controllers/validate-totp.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ValidateTOTPService } from 'src/application/services/validate-totp.service';
import { ValidateTOTPDto } from './dto/validate-totp.dto';

@Controller('otp/totp/validate')
export class ValidateTOTPController {
  constructor(private readonly validateTOTPService: ValidateTOTPService) {}

  @Post()
  async handle(@Body() body: ValidateTOTPDto) {
    const { userId, token } = body;
    const isValid = await this.validateTOTPService.execute(userId, token);
    return { isValid };
  }
}
