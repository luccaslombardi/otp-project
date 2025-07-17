import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from 'src/domain/usecases/auth/login.usecase';


@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  async login(@Body('secret') secret: string) {
    return this.loginUseCase.execute(secret);
  }
}
