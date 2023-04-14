import { IsNotEmpty, IsUUID } from 'class-validator';

export class AccessTokenDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  email: string;
}
