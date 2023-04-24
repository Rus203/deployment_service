import { IsNotEmpty, MaxLength, IsEmail } from 'class-validator';

export class AuthSignInDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}
