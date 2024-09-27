import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateOTPDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
