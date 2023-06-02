import { IsNotEmpty, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class GetMiniBackDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @MaxLength(255)
  sshServerPrivateKeyPath?: string;

  @IsOptional()
  @MaxLength(2047)
  sshConnectionString?: string;

  @IsOptional()
  @MaxLength(2047)
  serverUrl?: string;

  @IsOptional()
  nameRemoteRepository?: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
