import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DeployStatusMiniBack, DeleteStatusMiniBack } from 'src/utils';

@WebSocketGateway({ cors: '*' })
export class StatusDeployGateway {
  @WebSocketServer() server: Server;
  sendStatus(status: DeleteStatusMiniBack | DeployStatusMiniBack) {
    this.server.emit('deploy-status', status);
  }
}
