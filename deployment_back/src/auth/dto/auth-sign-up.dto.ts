import { IsNotEmpty, MaxLength, IsEmail } from 'class-validator';

export class AuthSignUpDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}
