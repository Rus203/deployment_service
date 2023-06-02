import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMiniBackDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(2047)
  sshConnectionString: string;
}
