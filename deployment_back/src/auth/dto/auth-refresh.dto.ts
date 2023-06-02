import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthRefreshDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
