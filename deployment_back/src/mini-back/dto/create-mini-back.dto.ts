import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { MiniBack } from '../mini-back.entity';

export class CreateMiniBackDto extends PartialType(MiniBack) {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @MaxLength(2047)
  serverUrl: string;
}
