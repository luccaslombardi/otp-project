import { Controller, Post, Body } from '@nestjs/common';
import { ValidateTOTPService } from 'src/application/services/totp/validate-totp.service';
import { ValidateTOTPDto } from './dto/validate-totp.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('otp')
@Controller('otp/totp/validate')
export class ValidateTOTPController {
  constructor(private readonly validateTOTPService: ValidateTOTPService) {}

  @Post()
  @ApiOperation({ summary: 'Valida um token HOTP' })
  @ApiBody({ type: ValidateTOTPDto })
  @ApiResponse({ status: 200, description: 'Token validado' })
  async validateTOTPController(@Body() body: ValidateTOTPDto) {
    const { userId, token } = body;
    const isValid = await this.validateTOTPService.execute(userId, token);
    return { isValid };
  }
}
