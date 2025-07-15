import { Injectable, Inject, NotFoundException, Logger } from "@nestjs/common";
import { UserOtpRepository } from "src/domain/repositories/user-otp.repository";

@Injectable()
export class GetUserOtpService {
  private readonly logger = new Logger(GetUserOtpService.name);

  constructor(
    @Inject('UserOtpRepository')
    private readonly userOtpRepository: UserOtpRepository,
  ) {}

  async execute(userId: string) {
    this.logger.log(`Consultando o user ${userId} no banco de dados`);

    try {
      const userOtp = await this.userOtpRepository.findByUserId(userId); 
      this.logger.log(`User ${userId} consultado no banco de dados: ${userOtp}`);

      return userOtp
    } catch (error) {
      this.logger.error(`Erro ao consultar usuário no banco de dados para userId ${userId}`,error.stack)
      throw new NotFoundException('Erro ao buscar dados do OTP');
    }
  }
}
