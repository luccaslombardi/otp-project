import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async execute(secret: string): Promise<{ access_token: string }> {
    const expectedSecret = this.configService.get<string>('JWT_SECRET');

    this.logger.log('Executando autenticação com SECRET');

    if (secret !== expectedSecret) {
      this.logger.warn('Tentativa de autenticação com secret inválido.');
      throw new UnauthorizedException('Secret inválido');
    }

    const access_token = this.jwtService.sign(
      { sub: 'user' },
      { secret: expectedSecret }
    );

    this.logger.log('Token JWT gerado com sucesso');

    return { access_token };
  }
}
