import { PartialType } from '@nestjs/swagger';
import { Project } from '../project.entity';
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsUUID,
} from 'class-validator';

export class CreateProjectDto extends PartialType(Project) {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MaxLength(2047)
  gitProjectLink: string;

  @MaxLength(65535)
  @MinLength(1)
  port: number;

  @IsNotEmpty()
  @IsUUID()
  miniBackId: string;
}
