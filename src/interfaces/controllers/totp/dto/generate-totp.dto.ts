import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class GenerateTOTPDto {
    @ApiProperty({ description: 'ID do usuário para gerar o token TOTP' })
    @IsString({message: 'O userId deve ser uma string válida.'})
    @IsNotEmpty({message: 'O campo userId é obrigatório.'})
    userId: string;
}