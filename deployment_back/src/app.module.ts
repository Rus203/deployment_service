import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { AuthModule } from './auth/auth.module';
import { AccessTokenModule } from './access-token/access-token.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { typeOrmConfig } from './configs';
import { redisConfig } from './configs';
import { SSHModule } from './ssh/ssh.module';
import { FileEncryptorModule } from './file-encryptor/files-encryptor.module';
import { MiniBackModule } from './mini-back/mini-back.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RedisModule.forRoot(redisConfig),
    UserModule,
    RefreshTokenModule,
    AuthModule,
    AccessTokenModule,
    RedisModule,
    SSHModule,
    FileEncryptorModule,
    MiniBackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
