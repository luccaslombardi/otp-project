import { GenerateTOTPUseCase } from 'src/domain/usecases/totp/generate-totp.usecase';
import { totp, authenticator  } from 'otplib';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserOtpRepository } from 'src/domain/repositories/user-otp.repository';
import { formatToBrazilianDate } from 'src/utils/format-date.util';
import { GetUserOtpService } from '../get-user-otp.service';

@Injectable()
export class GenerateTOTPService implements GenerateTOTPUseCase {
  private readonly logger = new Logger(GenerateTOTPService.name);

  constructor(
    @Inject('UserOtpRepository')
    private readonly userOtpRepository: UserOtpRepository,
    private readonly getUserOtpService: GetUserOtpService,
  ) {}
  
  async execute(userId: string) {
    this.logger.log(`Gerando TOTP para user ${userId}`);

    const existing = await this.getUserOtpService.execute(userId);
    const secret = existing?.secret || authenticator.generateSecret();

    const token = totp.generate(secret)
    const step = totp.options.step || 300 ;

    const createdAt = new Date(Date.now());
    const expiresAt = new Date(Date.now() + step * 1000);

    try {
      if (!existing) {
        this.logger.log(`Usuário não encontrado, criando novo registro para user ${userId}`);

        await this.userOtpRepository.save(
          userId, 
          secret,
          'TOTP',
          createdAt.toISOString(), 
          expiresAt.toISOString()
        );
      } 
      else {
        this.logger.warn(`Atualizando registros para ${userId} com os dados`);

        const updatedAt = new Date().toISOString();
        await this.userOtpRepository.updateOtpMetadata(userId, 'TOTP', updatedAt, expiresAt.toISOString());
      }
      
    } catch (error) {
      this.logger.error(`Erro ao salvar/atualizar usuário no banco de dados para user ${userId}`, error.stack);
      throw new Error('Erro ao salvar no banco de dados. Tente novamente mais tarde.');
    }

    this.logger.log(`Token TOTP gerado para user ${userId}`);

    return {
      token,
      createdAt: formatToBrazilianDate(createdAt),
      expiresAt: formatToBrazilianDate(expiresAt),
    };
  }
}
