import { GenerateHOTPUseCase } from 'src/domain/usecases/hotp/generate-hotp.usecase';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hotp } from 'otplib';

@Injectable()
export class GenerateHOTPService implements GenerateHOTPUseCase {
  constructor(private readonly configService: ConfigService) {}

  async execute(userId: string, counter: number) {
    const secret = this.configService.get<string>('OTP_STATIC_SECRET');

    if (!secret) {
      throw new Error('OTP secret is not defined');
    }

    const token = hotp.generate(secret, counter);

    return { token };
  }
}
