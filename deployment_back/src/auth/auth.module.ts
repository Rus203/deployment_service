import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { AccessTokenModule } from 'src/access-token/access-token.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UserModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    RefreshTokenModule,
    AccessTokenModule,
    PassportModule.register({}),
  ],
})
export class AuthModule {}
