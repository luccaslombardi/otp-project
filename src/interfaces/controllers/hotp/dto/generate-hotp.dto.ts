import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class GenerateHOTPDto {
  @IsString({ message: 'O userId deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo userId é obrigatório.' })
  userId: string;
}
