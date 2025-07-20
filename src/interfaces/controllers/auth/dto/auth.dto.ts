import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'Secret para gerar gerar o Beare Token que será necessário como autenticação nos demais endpoints.' })
  @IsString({ message: 'O secret deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo secret é obrigatório.' })
  secret: string;
}
