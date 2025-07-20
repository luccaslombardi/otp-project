import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ValidateHOTPService } from 'src/application/services/hotp/validate-hotp.service';
import { ValidateHOTPDto } from './dto/validate-hotp.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infraestructure/auth/strategies/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('otp')
@Controller('otp/hotp/validate')
export class ValidateHOTPController {
  constructor(private readonly validateHOTPService: ValidateHOTPService) {}

  @Post()
  @ApiOperation({ summary: 'Valida um token HOTP' })
  @ApiBody({ type: ValidateHOTPDto })
  @ApiResponse({ status: 200, description: 'Token validado' })
  async validateHOTPController(@Body() body: ValidateHOTPDto) {
    const { userId, token, counter } = body;
    const isValid = await this.validateHOTPService.execute(userId, token, counter);
    return { isValid };
  }
}
