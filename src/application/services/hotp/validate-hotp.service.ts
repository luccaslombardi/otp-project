import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hotp } from 'otplib';
import { ValidateHOTPUseCase } from 'src/domain/usecases/hotp/validate-hotp.usecase';
import { GetUserOtpService } from '../get-user-otp.service';

@Injectable()
export class ValidateHOTPService implements ValidateHOTPUseCase {
  constructor(private readonly getUserOtpService: GetUserOtpService) {}

  async execute(userId: string, token: string, counter: number): Promise<boolean> {
    try {
      const existing = await this.getUserOtpService.execute(userId);
      
      if (!existing || !existing.secret) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      if (existing.typeOtp !== 'HOTP') {
        throw new BadRequestException('Tipo de token incorreto.');
      }

      const isValid = hotp.check(token, existing.secret, counter);
      return isValid;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Erro ao validar token HOTP:', error);
      throw new Error('Erro ao validar token. Tente novamente mais tarde.');
    }
  }
}
