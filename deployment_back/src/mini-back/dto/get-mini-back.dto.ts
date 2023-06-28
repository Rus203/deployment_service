import { PartialType } from '@nestjs/swagger';
import { CreateMiniBackDto } from './create-mini-back.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetMiniBackDto extends PartialType(CreateMiniBackDto) {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
