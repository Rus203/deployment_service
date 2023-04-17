import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerModule } from './server/server.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { AuthModule } from './auth/auth.module';
import { AccessTokenModule } from './access-token/access-token.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { typeOrmConfig } from './configs';
import { redisConfig } from './configs';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    RedisModule.forRoot(redisConfig),
    ServerModule,
    RefreshTokenModule,
    AuthModule,
    AccessTokenModule,
    RedisModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
