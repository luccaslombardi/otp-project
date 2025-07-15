import { GenerateHOTPUseCase } from 'src/domain/usecases/hotp/generate-hotp.usecase';
import { Inject, Injectable, Logger  } from '@nestjs/common';
import { authenticator, hotp } from 'otplib';
import { formatToBrazilianDate } from 'src/utils/format-date.util';
import { UserOtpRepository } from 'src/domain/repositories/user-otp.repository';
import { GetUserOtpService } from '../get-user-otp.service';

@Injectable()
export class GenerateHOTPService implements GenerateHOTPUseCase {
  private readonly logger = new Logger(GenerateHOTPService.name);

  constructor(
    @Inject('UserOtpRepository')
    private readonly userOtpRepository: UserOtpRepository,
    private readonly getUserOtpService: GetUserOtpService,
  ) {}

  async execute(userId: string) {
    this.logger.log(`Gerando HOTP para user ${userId}`);

    const existing = await this.getUserOtpService.execute(userId);
    const secret = existing?.secret || authenticator.generateSecret();
    const currentCounter = existing?.counter ?? 0;
    const newCounter = currentCounter + 1;

    const token = hotp.generate(secret, newCounter);
    const createdAt = new Date(Date.now());

    try {
      if (!existing) {
        this.logger.log(`Usuário não encontrado, criando novo registro para user ${userId}`);

        const createdAt = new Date(Date.now());

        await this.userOtpRepository.save(
          userId, 
          secret,
          'HOTP',
          createdAt.toISOString(),
          undefined, //não tem data de expiração
          newCounter
        );
      } 
      else if (existing.typeOtp !== 'HOTP') {
        this.logger.warn(`Tipo OTP diferente para user ${userId}. Atualizando tipo para HOTP`);

        const updatedAt = new Date().toISOString();
        await this.userOtpRepository.updateOtpMetadata(userId, 'HOTP', updatedAt);
        
      } 
      else {
        this.logger.log(`Atualizando contador para user ${userId} para counter ${newCounter}`);

        const updatedAt = new Date().toISOString();
        await this.userOtpRepository.updateCounter(userId, newCounter, updatedAt);
      }    
    } catch (error) {
      this.logger.error(`Erro ao salvar/atualizar usuário no banco de dados para user ${userId}`, error.stack);
      throw new Error('Erro ao salvar no banco de dados. Tente novamente mais tarde.');
    }

    this.logger.log(`Token HOTP gerado para user ${userId} com counter ${newCounter}`);

    return { 
      token,
      counter: newCounter,
      createdAt: formatToBrazilianDate(createdAt)
     };
  }
}
