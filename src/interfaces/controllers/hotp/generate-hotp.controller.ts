// src/interfaces/controllers/generate-hotp.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { GenerateHOTPService } from 'src/application/services/hotp/generate-hotp.service';
import { GenerateHOTPDto } from './dto/generate-hotp.dto';

@Controller('otp/hotp')
export class GenerateHOTPController {
  constructor(private readonly generateHOTPService: GenerateHOTPService) {}

  @Post()
  async handle(@Body() body: GenerateHOTPDto) {
    const { userId } = body;
    const result = await this.generateHOTPService.execute(userId);
    return result;
  }
}
