import { GenerateHOTPService } from '../../../../src/application/services/hotp/generate-hotp.service';
import { GetUserOtpService } from '../../../../src/application/services/get-user-otp.service';
import { UserOtpRepository } from 'src/domain/repositories/user-otp.repository';
import { hotp, authenticator } from 'otplib';

jest.mock('otplib', () => ({
  hotp: {
    generate: jest.fn(),
  },
  authenticator: {
    generateSecret: jest.fn(),
  },
}));

describe('GenerateHOTPService', () => {
  let service: GenerateHOTPService;
  let getUserOtpService: jest.Mocked<GetUserOtpService>;
  let userOtpRepository: jest.Mocked<UserOtpRepository>;

  beforeEach(() => {
    getUserOtpService = {
      execute: jest.fn(),
    } as any;

    userOtpRepository = {
      save: jest.fn(),
      updateOtpMetadata: jest.fn(),
      updateCounter: jest.fn(),
    } as any;

    service = new GenerateHOTPService(userOtpRepository, getUserOtpService);
  });

  it('deve criar um novo HOTP se o usuario nao existir', async () => {
    getUserOtpService.execute.mockResolvedValue(null);
    (authenticator.generateSecret as jest.Mock).mockReturnValue('NEW_SECRET');
    (hotp.generate as jest.Mock).mockReturnValue('123456');

    const result = await service.execute('user123');

    expect(userOtpRepository.save).toHaveBeenCalledWith(
      'user123',
      'NEW_SECRET',
      'HOTP',
      expect.any(String),
      undefined,
      1
    );
    expect(result.token).toBe('123456');
    expect(result.counter).toBe(1);
  });

  it('deve atualizar typeOtp se o tipo atual for diferente de HOTP', async () => {
    getUserOtpService.execute.mockResolvedValue({
      userId: 'user123',
      secret: 'EXISTING_SECRET',
      typeOtp: 'TOTP',
      counter: 5,
      createdAt: '23/12/23',
    });

    (hotp.generate as jest.Mock).mockReturnValue('654321');

    const result = await service.execute('user123');

    expect(userOtpRepository.updateOtpMetadata).toHaveBeenCalledWith(
      'user123',
      'HOTP',
      expect.any(String)
    );
    expect(result.token).toBe('654321');
    expect(result.counter).toBe(6);
  });

  it('deve atualizar o counter se o tipoOtp for HOTP', async () => {
    getUserOtpService.execute.mockResolvedValue({
      userId: 'user123',
      secret: 'EXISTING_SECRET',
      typeOtp: 'HOTP',
      counter: 2,
      createdAt: '23/12/23',
    });

    (hotp.generate as jest.Mock).mockReturnValue('000000');

    const result = await service.execute('user123');

    expect(userOtpRepository.updateCounter).toHaveBeenCalledWith(
      'user123',
      3,
      expect.any(String)
    );
    expect(result.token).toBe('000000');
    expect(result.counter).toBe(3);
  });

  it('deve retornar erro se houver falha no salvamento', async () => {
    getUserOtpService.execute.mockResolvedValue(null);
    (authenticator.generateSecret as jest.Mock).mockReturnValue('FAIL_SECRET');
    (hotp.generate as jest.Mock).mockReturnValue('999999');
    userOtpRepository.save.mockRejectedValue(new Error('Falha ao salvar'));

    await expect(service.execute('user123')).rejects.toThrow(
      'Erro ao salvar no banco de dados. Tente novamente mais tarde.'
    );
  });
});
