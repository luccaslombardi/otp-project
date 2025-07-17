import { GenerateTOTPService } from 'src/application/services/totp/generate-totp.service';
import { GetUserOtpService } from 'src/application/services/get-user-otp.service';
import { UserOtpRepository } from 'src/domain/repositories/user-otp.repository';
import { totp, authenticator } from 'otplib';

jest.mock('otplib', () => ({
  ...jest.requireActual('otplib'),
  totp: {
    generate: jest.fn(),
    options: { step: 300 },
  },
  authenticator: {
    generateSecret: jest.fn(),
  },
}));

describe('GenerateTOTPService', () => {
  let service: GenerateTOTPService;
  let mockUserOtpRepository: jest.Mocked<UserOtpRepository>;
  let mockGetUserOtpService: jest.Mocked<GetUserOtpService>;

  beforeEach(() => {
    mockUserOtpRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      updateCounter: jest.fn(),
      updateOtpMetadata: jest.fn(),
    };

    mockGetUserOtpService = {
      execute: jest.fn(),
    } as any;

    service = new GenerateTOTPService(mockUserOtpRepository, mockGetUserOtpService);
  });

  it('deve gerar um novo TOTP e salvar caso o usuario nao exista', async () => {
    mockGetUserOtpService.execute.mockResolvedValue(null);
    (authenticator.generateSecret as jest.Mock).mockReturnValue('secret123');
    (totp.generate as jest.Mock).mockReturnValue('123456');

    const result = await service.execute('user123');

    expect(mockUserOtpRepository.save).toHaveBeenCalledWith(
      'user123',
      'secret123',
      'TOTP',
      expect.any(String),
      expect.any(String)
    );

    expect(result.token).toBe('123456');
    expect(result.createdAt).toBeDefined();
    expect(result.expiresAt).toBeDefined();
  });

  it('deve atualizar o typeOtp caso o usuario ja esteja criado', async () => {
    mockGetUserOtpService.execute.mockResolvedValue({
      userId: 'user123',
      secret: 'existing-secret',
      typeOtp: 'HOTP',
      createdAt: '23/12/23',
    });

    (totp.generate as jest.Mock).mockReturnValue('654321');

    const result = await service.execute('user123');

    expect(mockUserOtpRepository.updateOtpMetadata).toHaveBeenCalledWith(
      'user123',
      'TOTP',
      expect.any(String),
      expect.any(String)
    );

    expect(result.token).toBe('654321');
  });

  it('deve retornar erro se o salvamento falhar', async () => {
    mockGetUserOtpService.execute.mockResolvedValue(null);
    (authenticator.generateSecret as jest.Mock).mockReturnValue('secret-fail');
    (totp.generate as jest.Mock).mockReturnValue('000000');
    mockUserOtpRepository.save.mockRejectedValue(new Error('DB failure'));

    await expect(service.execute('fail-user')).rejects.toThrow('Erro ao salvar no banco de dados. Tente novamente mais tarde.');
  });
});
