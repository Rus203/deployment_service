import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Project } from '../project.entity';
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsUUID,
} from 'class-validator';

export class CreateProjectDto extends PartialType(Project) {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(2047)
  gitProjectLink: string;

  @ApiProperty({ default: 10000 })
  @MaxLength(65535)
  @MinLength(1)
  port: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  miniBackId: string;
}
