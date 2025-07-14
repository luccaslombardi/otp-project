import { GenerateTOTPUseCase } from 'src/domain/usecases/totp/generate-totp.usecase';
import { totp, authenticator  } from 'otplib';
import { Inject, Injectable } from '@nestjs/common';
import { UserOtpRepository } from 'src/domain/repositories/user-otp.repository';
import { formatToBrazilianDate } from 'src/utils/format-date.util';
import { GetUserOtpService } from '../get-user-otp.service';

@Injectable()
export class GenerateTOTPService implements GenerateTOTPUseCase {
  constructor(
    @Inject('UserOtpRepository')
    private readonly userOtpRepository: UserOtpRepository,
    private readonly getUserOtpService: GetUserOtpService,
  ) {}
  
  async execute(userId: string) {

    const existing = await this.getUserOtpService.execute(userId);
    const secret = existing?.secret || authenticator.generateSecret();

    const token = totp.generate(secret);
    const step = totp.options.step || 120;

    const createdAt = new Date(Date.now());
    const expiresAt = new Date(Date.now() + step * 1000);

    try {
      await this.userOtpRepository.save(
        userId, 
        secret, 
        createdAt.toISOString(), 
        expiresAt.toISOString()
      );
      
    } catch (error) {
      console.error('Erro ao salvar o token TOTP no banco de dados:', error);
      throw new Error('Erro ao gerar token. Tente novamente mais tarde.');
    }

    

    return {
      token,
      createdAt: formatToBrazilianDate(createdAt),
      expiresAt: formatToBrazilianDate(expiresAt),
    };
  }
}
