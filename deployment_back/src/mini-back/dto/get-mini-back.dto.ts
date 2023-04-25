import { PartialType } from '@nestjs/swagger';
import { CreateMiniBackDto } from './create-mini-back.dto';
import { IsUUID } from 'class-validator';

export class GetMiniBackDto extends PartialType(CreateMiniBackDto) {
  @IsUUID()
  userId: string;
}
