import { Controller, Post, Body } from '@nestjs/common';
import { GenerateTOTPService } from 'src/application/services/totp/generate-totp.service';
import { GenerateTOTPDto } from './dto/generate-totp.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('otp')
@Controller('otp/totp')
export class GenerateTOTPController {
  constructor(private readonly generateTOTPService: GenerateTOTPService) {}

  @Post()
  @ApiOperation({ summary: 'Gera um token TOTP para o usuário' })
  @ApiBody({ type: GenerateTOTPDto })
  @ApiResponse({ status: 200, description: 'Token gerado com sucesso' })
  async generateTOTPController(@Body() body: GenerateTOTPDto) {
    const { userId } = body;
    const result = await this.generateTOTPService.execute(userId);
    return result;
  }
}
