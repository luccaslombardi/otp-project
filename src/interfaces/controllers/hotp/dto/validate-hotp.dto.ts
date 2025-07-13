import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class ValidateHOTPDto {
  @IsString({ message: 'O userId deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo userId é obrigatório.' })
  userId: string;

  @IsString({ message: 'O token deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo token é obrigatório.' })

  token: string;

  @IsInt({ message: 'O counter deve ser um número inteiro.' })
  @Min(0, { message: 'O counter deve ser no mínimo 0.' })
  @Max(60, { message: 'O counter deve ser no máximo 60.' })
  counter: number;
}
