import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, MaxLength, IsEmail, MinLength } from 'class-validator';
import { User } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends PartialType(User) {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  password: string;
}
