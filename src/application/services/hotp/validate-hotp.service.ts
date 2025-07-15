import { BadRequestException, HttpException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { hotp } from 'otplib';
import { ValidateHOTPUseCase } from 'src/domain/usecases/hotp/validate-hotp.usecase';
import { GetUserOtpService } from '../get-user-otp.service';

@Injectable()
export class ValidateHOTPService implements ValidateHOTPUseCase {
  private readonly logger = new Logger(ValidateHOTPService.name);

  constructor(private readonly getUserOtpService: GetUserOtpService) {}

  async execute(userId: string, token: string, counter: number): Promise<boolean> {
    this.logger.log(`Validando HOTP para user ${userId} com counter ${counter}`);

    try {
      const existing = await this.getUserOtpService.execute(userId);
      
      if (!existing || !existing.secret) {
        this.logger.warn(`Usuário não encontrado: ${userId}`);

        throw new NotFoundException('Usuário não encontrado.');
      }

      if (existing.typeOtp !== 'HOTP') {
        this.logger.warn(`Tipo de token incorreto para user ${userId}: esperado HOTP e recebido ${existing.typeOtp}`);

        throw new BadRequestException('Tipo de token incorreto.');
      }

      const isValid = hotp.check(token, existing.secret, counter);
      this.logger.log(`Validação HOTP para userId ${userId} realizada. Retorno: ${isValid}`);

      return isValid;

    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.warn(`Erro durante validação HOTP para userId=${userId}: ${error.message}`);
        throw error;
      }

      this.logger.error('Erro ao validar token HOTP:', error.stack);
      throw new Error('Erro ao validar token. Tente novamente mais tarde.');
    }
  }
}
