
import { UserOtpRepository } from 'src/domain/repositories/user-otp.repository';
import { NotFoundException } from '@nestjs/common';
import { GetUserOtpService } from 'src/application/services/get-user-otp.service';

describe('GetUserOtpService', () => {
  let service: GetUserOtpService;
  let userOtpRepository: jest.Mocked<UserOtpRepository>;

  beforeEach(() => {
    userOtpRepository = {
      findByUserId: jest.fn(),
      save: jest.fn(),
      updateCounter: jest.fn(),
    } as unknown as jest.Mocked<UserOtpRepository>;

    service = new GetUserOtpService(userOtpRepository);
  });

  it('deve retornar o usuário OTP se ele existir', async () => {
    const mockUser = {
      userId: 'user123',
      secret: 'SECRET',
      typeOtp: 'TOTP' as const,
      createdAt: '23/12/23',
    };

    userOtpRepository.findByUserId.mockResolvedValue(mockUser);

    const result = await service.execute('user123');
    expect(result).toEqual(mockUser);
    expect(userOtpRepository.findByUserId).toHaveBeenCalledWith('user123');
  });

  it('deve retornar NotFoundException se houver erro na busca', async () => {
    userOtpRepository.findByUserId.mockRejectedValue(new Error('DB Error'));

    await expect(service.execute('user123')).rejects.toThrow(NotFoundException);
    expect(userOtpRepository.findByUserId).toHaveBeenCalledWith('user123');
  });
});
