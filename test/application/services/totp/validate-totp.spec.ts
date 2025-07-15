import { ValidateTOTPService } from 'src/application/services/totp/validate-totp.service';
import { GetUserOtpService } from 'src/application/services/get-user-otp.service';
import { NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { totp } from 'otplib';

jest.mock('otplib', () => ({
  totp: {
    check: jest.fn(),
  },
}));

describe('ValidateTOTPService', () => {
  let service: ValidateTOTPService;
  let getUserOtpService: Partial<GetUserOtpService>;

  beforeEach(() => {
    getUserOtpService = {
      execute: jest.fn(),
    };
    service = new ValidateTOTPService(getUserOtpService as GetUserOtpService);
  });

  it('deve retornar um erro NotFoundException caso usuario nao seja encontrado ou nao tenha secret', async () => {
    (getUserOtpService.execute as jest.Mock).mockResolvedValue(null);

    await expect(service.execute('user1', 'token'))
      .rejects
      .toThrow(NotFoundException);
  });

  it('deve retornar o erro BadRequestException caso o token  nao seja TOTP', async () => {
    (getUserOtpService.execute as jest.Mock).mockResolvedValue({
      secret: 'secret',
      typeOtp: 'HOTP',
    });

    await expect(service.execute('user1', 'token'))
      .rejects
      .toThrow(BadRequestException);
  });

  it('deve retornar true se token for valido', async () => {
    (getUserOtpService.execute as jest.Mock).mockResolvedValue({
      secret: 'secret',
      typeOtp: 'TOTP',
    });
    (totp.check as jest.Mock).mockReturnValue(true);

    const result = await service.execute('user1', 'token');
    expect(result).toBe(true);
    expect(totp.check).toHaveBeenCalledWith('token', 'secret');
  });

  it('deve retornar false se o token nao for valido', async () => {
    (getUserOtpService.execute as jest.Mock).mockResolvedValue({
      secret: 'secret',
      typeOtp: 'TOTP',
    });
    (totp.check as jest.Mock).mockReturnValue(false);

    const result = await service.execute('user1', 'token');
    expect(result).toBe(false);
  });

  it('retorna erro se acontecer algum erro inesperado', async () => {
    (getUserOtpService.execute as jest.Mock).mockRejectedValue(new Error('DB failure'));

    await expect(service.execute('user1', 'token'))
      .rejects
      .toThrow('Erro ao validar token. Tente novamente mais tarde.');
  });
});
