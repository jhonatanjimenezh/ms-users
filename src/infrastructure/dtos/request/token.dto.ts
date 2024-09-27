import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @IsNotEmpty({ message: 'El token no puede estar vacío' })
  @IsString({ message: 'El token debe ser un texto válido' })
  token: string;
}
