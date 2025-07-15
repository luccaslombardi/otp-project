import { ValidateTOTPUseCase } from 'src/domain/usecases/totp/validate-totp.usecase';
import { totp } from 'otplib';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { GetUserOtpService } from '../get-user-otp.service';

@Injectable()
export class ValidateTOTPService implements ValidateTOTPUseCase {
  constructor(private readonly getUserOtpService: GetUserOtpService) {}

  async execute(userId: string, token: string) {

    try {
      const existing = await this.getUserOtpService.execute(userId);

      if (!existing || !existing.secret) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      const isValid = totp.check(token, existing.secret);
      return isValid;
      
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Erro ao validar token TOTP:', error);
      throw new Error('Erro ao validar token. Tente novamente mais tarde.');
    }
  }
}
