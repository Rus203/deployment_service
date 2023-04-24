import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from './refresh-token.entity';

@Module({
  controllers: [],
  providers: [RefreshTokenService],
  imports: [
    JwtModule.register({
      secret: process.env.REFRESH_SECRET,
      signOptions: { expiresIn: process.env.REFRESH_TIMEOUT },
    }),
    TypeOrmModule.forFeature([RefreshToken])],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
