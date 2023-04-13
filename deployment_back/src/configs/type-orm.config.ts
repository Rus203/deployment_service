import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/entities';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  entities: [User],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
};

export default typeOrmConfig;
