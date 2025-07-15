import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length } from "class-validator";

export class ValidateTOTPDto {

    @ApiProperty({ description: 'ID do usuário para validar o token TOTP' })
    @IsString({message: 'O userId deve ser uma string válida.'})
    @IsNotEmpty({message: 'O campo userId é obrigatório.'})
    userId: string;

    @ApiProperty({ description: 'Token TOTP que deve ser vaidado' })
    @IsString({message: 'O token deve ser uma string numérica'})
    @IsNotEmpty({message: 'O campo token é obrigatório válida.'})
    @Length(6, 6, {message: 'O token deve conteer exatamente 6 dígitos.'}) 
    token: string;
}