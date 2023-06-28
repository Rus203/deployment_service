import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { MiniBack } from '../mini-back.entity';

export class CreateMiniBackDto extends PartialType(MiniBack) {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(2047)
  sshConnectionString: string;
}
