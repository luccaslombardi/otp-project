import { Injectable, Inject, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { UserOtpRepository } from "src/domain/repositories/user-otp.repository";

@Injectable()
export class GetUserOtpService {
  constructor(
    @Inject('UserOtpRepository')
    private readonly userOtpRepository: UserOtpRepository,
  ) {}

  async execute(userId: string) {
    try {
       const userOtp = await this.userOtpRepository.findByUserId(userId); 

       return userOtp
    } catch (error) {
        console.error('Erro ao buscar o usuario', error);
        throw new NotFoundException('Erro ao buscar dados do OTP');
    }
  }
}
