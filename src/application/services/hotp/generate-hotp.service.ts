import { GenerateHOTPUseCase } from 'src/domain/usecases/hotp/generate-hotp.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { authenticator, hotp } from 'otplib';
import { formatToBrazilianDate } from 'src/utils/format-date.util';
import { UserOtpRepository } from 'src/domain/repositories/user-otp.repository';
import { GetUserOtpService } from '../get-user-otp.service';

@Injectable()
export class GenerateHOTPService implements GenerateHOTPUseCase {
  constructor(
    @Inject('UserOtpRepository')
    private readonly userOtpRepository: UserOtpRepository,
    private readonly getUserOtpService: GetUserOtpService,
  ) {}

  async execute(userId: string) {

    const existing = await this.getUserOtpService.execute(userId);
    const secret = existing?.secret || authenticator.generateSecret();
    const currentCounter = existing?.counter ?? 0;
    const newCounter = currentCounter + 1;

    const token = hotp.generate(secret, newCounter);
    const createdAt = new Date(Date.now());

    try {
      if (!existing) {
        const createdAt = new Date(Date.now());

        await this.userOtpRepository.save(
          userId, 
          secret,
          'HOTP',
          createdAt.toISOString(),
          undefined, //não tem data de expiração
          newCounter
        );
      } else{
        const updatedAt = new Date().toISOString();

        await this.userOtpRepository.updateCounter(userId, newCounter, updatedAt);
      }    
    } catch (error) {
      console.error('Erro ao salvar/atualizar usuario no banco de dados:', error);
      throw new Error('Erro ao salvar no banco de dados. Tente novamente mais tarde.');
    }

    return { 
      token,
      counter: newCounter,
      createdAt: formatToBrazilianDate(createdAt)
     };
  }
}
