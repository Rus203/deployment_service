import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { RefreshToken } from 'src/refresh-token/refresh-token.entity';
import { MiniBack } from 'src/mini-back/mini-back.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, RefreshToken, MiniBack],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
};
