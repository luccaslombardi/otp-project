import { ValidateTOTPUseCase } from 'src/domain/usecases/totp/validate-totp.usecase';
import { totp } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateTOTPService implements ValidateTOTPUseCase {
  constructor(private readonly configService: ConfigService) {}

  async execute(userId: string, token: string) {
    const secret = this.configService.get<string>('OTP_STATIC_SECRET');

    if (!secret) {
      throw new Error('OTP secret is not defined');
    }

    const isValid = totp.check(token, secret);
    return isValid;
  }
}
