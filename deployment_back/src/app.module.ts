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
import { SSHModule } from './ssh/ssh.module';
import { FileEncryptorModule } from './file-encryptor/files-encryptor.module';
import { MiniBackModule } from './mini-back/mini-back.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RedisModule.forRoot(redisConfig),
    UserModule,
    ServerModule,
    RefreshTokenModule,
    AuthModule,
    AccessTokenModule,
    RedisModule,
    ProjectModule,
    SSHModule,
    FileEncryptorModule,
    MiniBackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
