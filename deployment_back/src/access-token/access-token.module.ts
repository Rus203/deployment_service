import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AccessTokenService],
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TIMEOUT },
    }),
  ],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
