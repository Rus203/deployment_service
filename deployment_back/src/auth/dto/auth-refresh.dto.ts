import { IsNotEmpty, IsUUID } from 'class-validator';

export class AuthRefreshDto {
  @IsNotEmpty()
  @IsUUID()
  refreshToken: string;
}
