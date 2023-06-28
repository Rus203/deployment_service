import { ApiProperty } from '@nestjs/swagger';

export class AuthSignInResponseDto {
  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}
