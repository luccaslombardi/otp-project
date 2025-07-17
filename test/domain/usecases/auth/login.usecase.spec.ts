import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUseCase } from 'src/domain/usecases/auth/login.usecase';


describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(() => {

    configService = {
      get: jest.fn().mockReturnValue('my-secret-from-env'),
    } as unknown as ConfigService;

    jwtService = new JwtService({ secret: 'my-secret-from-env' });

    loginUseCase = new LoginUseCase(jwtService, configService);
  });

  it('deve gerar token quando o secret estiver correto', async () => {
    const result = await loginUseCase.execute('my-secret-from-env');
    expect(result).toHaveProperty('access_token');
    expect(typeof result.access_token).toBe('string');
  });

  it('deve lançar UnauthorizedException quando o secret estiver errado', async () => {
    await expect(loginUseCase.execute('wrong-secret')).rejects.toThrow(UnauthorizedException);
  });
});
