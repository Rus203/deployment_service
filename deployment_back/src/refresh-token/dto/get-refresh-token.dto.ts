import { PartialType } from '@nestjs/mapped-types';
import { RefreshTokenDto } from './refresh-token.dto';

export class GetRefreshTokenDto extends PartialType(RefreshTokenDto) {}
