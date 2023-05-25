import { Module } from '@nestjs/common';
import { StatusDeployGateway } from './status-deploy.gateway';

@Module({
  providers: [StatusDeployGateway],
  exports: [StatusDeployGateway],
})
export class StatusDeployModule {}
