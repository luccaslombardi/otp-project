import { Controller, Post, Body } from '@nestjs/common';
import { GenerateHOTPService } from 'src/application/services/hotp/generate-hotp.service';
import { GenerateHOTPDto } from './dto/generate-hotp.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('otp')
@Controller('otp/hotp')
export class GenerateHOTPController {
  constructor(private readonly generateHOTPService: GenerateHOTPService) {}

  @Post()
  @ApiOperation({ summary: 'Gera um token HOTP para o usuário' })
  @ApiBody({ type: GenerateHOTPDto })
  @ApiResponse({ status: 200, description: 'Token gerado com sucesso' })
  async generateHOTPController(@Body() body: GenerateHOTPDto) {
    const { userId } = body;
    const result = await this.generateHOTPService.execute(userId);
    return result;
  }
}
