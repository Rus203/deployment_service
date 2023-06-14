import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DeleteStatus, DeployStatus } from 'src/enums';

@WebSocketGateway({ cors: '*' })
export class ProgressGateway {
  @WebSocketServer() server: Server;

  emitDeployStatus(status: DeployStatus) {
    this.server.emit('progress-deploy-mini-back', status);
  }

  emitDeleteStatus(status: DeleteStatus) {
    this.server.emit('progress-delete-mini-back', status);
  }
}
