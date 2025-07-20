import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from 'src/domain/usecases/auth/login.usecase';
import { AuthDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  async login(@Body() body: AuthDto) {
    const { secret } = body
    return this.loginUseCase.execute(secret);
  }
}
