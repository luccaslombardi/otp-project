import { ValidateHOTPService } from '../../../../src/application/services/hotp/validate-hotp.service';
import { GetUserOtpService } from '../../../../src/application/services/get-user-otp.service';
import { hotp } from 'otplib';
import { NotFoundException, BadRequestException } from '@nestjs/common';

jest.mock('otplib', () => ({
  hotp: {
    check: jest.fn(),
  },
}));

describe('ValidateHOTPService', () => {
  let service: ValidateHOTPService;
  let getUserOtpService: jest.Mocked<GetUserOtpService>;

  beforeEach(() => {
    getUserOtpService = {
      execute: jest.fn(),
    } as any;

    service = new ValidateHOTPService(getUserOtpService);
  });

  it('deve validar com sucesso se token HOTP for válido', async () => {
    const userId = 'user123';
    const token = '987654';
    const counter = 2;

    getUserOtpService.execute.mockResolvedValue({
      userId,
      secret: 'SECRET',
      typeOtp: 'HOTP',
      createdAt: new Date(),
      counter,
    });

    (hotp.check as jest.Mock).mockReturnValue(true);

    const result = await service.execute(userId, token, counter);

    expect(result).toBe(true);
    expect(hotp.check).toHaveBeenCalledWith(token, 'SECRET', counter);
  });

  it('deve retornar NotFoundException se usuário não for encontrado', async () => {
    getUserOtpService.execute.mockResolvedValue(null);

    await expect(service.execute('user123', '000000', 1)).rejects.toThrow(NotFoundException);
  });

  it('deve retornar BadRequestException se tipo de token for diferente de HOTP', async () => {
    getUserOtpService.execute.mockResolvedValue({
      userId: 'user123',
      secret: 'SECRET',
      typeOtp: 'TOTP',
      createdAt: new Date(),
    });

    await expect(service.execute('user123', '000000', 1)).rejects.toThrow(BadRequestException);
  });

  it('deve retornar erro se ocorrer algum erro nao tratado', async () => {
    getUserOtpService.execute.mockRejectedValue(new Error('DB exploded'));

    await expect(service.execute('user123', '000000', 1)).rejects.toThrow('Erro ao validar token. Tente novamente mais tarde.');
  });
});
