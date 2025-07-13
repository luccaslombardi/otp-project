import { GenerateTOTPUseCase } from 'src/domain/usecases/generate-totp.usecase';
import { authenticator, totp } from 'otplib';

export class GenerateTOTPService implements GenerateTOTPUseCase {
  async execute(userId: string) {
    const secret = authenticator.generateSecret(); 
    const token = totp.generate(secret);

    const step = totp.options.step || 30;
    const expiresAt = new Date(Date.now() + step * 1000);

    return {
      token,
      expiresAt,
    };
  }
}
