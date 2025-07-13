import { IsString, IsNotEmpty, Length } from "class-validator";

export class ValidateTOTPDto {
    @IsString({message: 'O userId deve ser uma string válida.'})
    @IsNotEmpty({message: 'O campo userId é obrigatório.'})
    userId: string;

    @IsString({message: 'O token deve ser uma string numérica'})
    @IsNotEmpty({message: 'O campo token é obrigatório válida.'})
    @Length(6, 6, {message: 'O token deve conteer exatamente 6 dígitos.'}) 
    token: string;
}