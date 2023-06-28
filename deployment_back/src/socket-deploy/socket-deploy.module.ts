import { Module } from '@nestjs/common';
import { SocketDeployGateway } from './socket-deploy.gateway';
import { JwtModule } from '@nestjs/jwt';
import { MiniBackModule } from 'src/mini-back/mini-back.module';

@Module({
  providers: [SocketDeployGateway],
  exports: [SocketDeployGateway],
  imports: [
    MiniBackModule,
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
    }),
  ],
})
export class SocketDeployModule {}
