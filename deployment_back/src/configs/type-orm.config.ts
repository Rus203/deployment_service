import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { RefreshToken } from 'src/refresh-token/refresh-token.entity';
import { Project } from 'src/project/project.entity';
import { MiniBack } from 'src/mini-back/mini-back.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  entities: [User, RefreshToken, Project, MiniBack],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
};
