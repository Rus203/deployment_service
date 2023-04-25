import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AuthRefreshDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  refreshToken: string;
}
