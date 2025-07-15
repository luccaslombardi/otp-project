import { ValidateTOTPUseCase } from 'src/domain/usecases/totp/validate-totp.usecase';
import { totp } from 'otplib';
import { BadRequestException, HttpException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { GetUserOtpService } from '../get-user-otp.service';

@Injectable()
export class ValidateTOTPService implements ValidateTOTPUseCase {
  private readonly logger = new Logger(ValidateTOTPService.name);

  constructor(private readonly getUserOtpService: GetUserOtpService) {}

  async execute(userId: string, token: string) {
    this.logger.log(`Validando TOTP para user ${userId}`);

    try {
      const existing = await this.getUserOtpService.execute(userId);

      if (!existing || !existing.secret) {
        this.logger.warn(`Usuário não encontrado: ${userId}`);
        throw new NotFoundException('Usuário não encontrado.');
      }

      if (existing.typeOtp != 'TOTP') {
        this.logger.warn(`Tipo de token incorreto para user ${userId}: esperado TOTP e recebido ${existing.typeOtp}`);
        throw new BadRequestException('Tipo de token incorreto.');
      }

      const isValid = totp.check(token, existing.secret);
      this.logger.log(`Validação TOTP para userId ${userId} realizada. Retorno: ${isValid}`);

      return isValid;
      
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.warn(`Erro durante validação TOTP para userId=${userId}: ${error.message}`);
        throw error;
      }

      this.logger.error('Erro ao validar token HOTP:', error.stack);
      throw new Error('Erro ao validar token. Tente novamente mais tarde.');
    }
  }
}
