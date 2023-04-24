import { PartialType } from '@nestjs/swagger';
import { CreateMiniBackDto } from './create-mini-back.dto';

export class UpdateMiniBackDto extends PartialType(CreateMiniBackDto) {
  isDeploy: boolean;
}
