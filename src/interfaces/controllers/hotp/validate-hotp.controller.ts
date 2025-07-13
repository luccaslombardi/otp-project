import { Controller, Post, Body } from '@nestjs/common';
import { ValidateHOTPService } from 'src/application/services/hotp/validate-hotp.service';
import { ValidateHOTPDto } from './dto/validate-hotp.dto';

@Controller('otp/hotp/validate')
export class ValidateHOTPController {
  constructor(private readonly validateHOTPService: ValidateHOTPService) {}

  @Post()
  async handle(@Body() body: ValidateHOTPDto) {
    const { userId, token, counter } = body;
    const isValid = await this.validateHOTPService.execute(userId, token, counter);
    return { isValid };
  }
}
