import { ApiProperty } from '@nestjs/swagger';

export class AuthUpdateTokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
