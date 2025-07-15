import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Length } from 'class-validator';

export class ValidateHOTPDto {

  @ApiProperty({ description: 'ID do usuário para validar o token HOTP' })
  @IsString({ message: 'O userId deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo userId é obrigatório.' })
  userId: string;

  @ApiProperty({ description: 'Token HOTP que deve ser vaidado' })
  @IsString({ message: 'O token deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo token é obrigatório.' })
  @Length(6, 6, {message: 'O token deve conteer exatamente 6 dígitos.'}) 
  token: string;

  @ApiProperty({ description: 'Counter para validação do token' })
  @IsInt({ message: 'O counter deve ser um número inteiro.' })
  @Min(0, { message: 'O counter deve ser no mínimo 0.' })
  counter: number;
}
