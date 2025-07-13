import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class GenerateHOTPDto {
  @IsString({ message: 'O userId deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo userId é obrigatório.' })
  userId: string;

  @IsInt({ message: 'O counter deve ser um número inteiro.' })
  @Min(0, { message: 'O counter deve ser no mínimo 0.' })
  @Max(60, { message: 'O counter deve ser no máximo 60.' })
  counter: number;
}
