import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, MaxLength, IsEmail, MinLength } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDto extends PartialType(User) {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  password: string;
}
