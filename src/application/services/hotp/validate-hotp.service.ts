import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hotp } from 'otplib';
import { ValidateHOTPUseCase } from 'src/domain/usecases/hotp/validate-hotp.usecase';

@Injectable()
export class ValidateHOTPService implements ValidateHOTPUseCase {
  constructor(private readonly configService: ConfigService) {}

  async execute(userId: string, token: string, counter: number): Promise<boolean> {
    const secret = this.configService.get<string>('OTP_STATIC_SECRET');

    if (!secret) {
      throw new Error('OTP secret is not defined');
    }

    const isValid = hotp.check(token, secret, counter);
    return isValid;
  }
}
