import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateHOTPDto {
  @ApiProperty({ description: 'ID do usuário para gerar o token HOTP' })
  @IsString({ message: 'O userId deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo userId é obrigatório.' })
  userId: string;
}
