import { GenerateTOTPUseCase } from 'src/domain/usecases/generate-totp.usecase';
import { totp } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateTOTPService implements GenerateTOTPUseCase {
  constructor(private readonly configService: ConfigService) {}
  
  async execute(userId: string) {
    const secret = this.configService.get<string>('OTP_STATIC_SECRET');

     if (!secret) {
      throw new Error('OTP secret is not defined');
    }

    const token = totp.generate(secret);
   
    const step = totp.options.step || 30;
    const expiresAt = new Date(Date.now() + step * 1000);

    return {
      token,
      expiresAt,
    };
  }
}
