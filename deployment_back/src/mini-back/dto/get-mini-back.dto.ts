import { PartialType } from '@nestjs/swagger';
import { CreateMiniBackDto } from './create-mini-back.dto';

export class GetMiniBackDto extends PartialType(CreateMiniBackDto) {}
