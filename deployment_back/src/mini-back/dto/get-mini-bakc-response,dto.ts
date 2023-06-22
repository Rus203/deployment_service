import { ApiProperty } from '@nestjs/swagger';
import { MiniBackState } from 'src/enums';

export class GetMiniBackResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  serverUrl: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  port: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  deployState: MiniBackState;
}
