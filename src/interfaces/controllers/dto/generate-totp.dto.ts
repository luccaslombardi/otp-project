import { IsString, IsNotEmpty, Length } from "class-validator";

export class GenerateTOTPDto {
    @IsString({message: 'O userId deve ser uma string válida.'})
    @IsNotEmpty({message: 'O campo userId é obrigatório.'})
    userId: string;
}