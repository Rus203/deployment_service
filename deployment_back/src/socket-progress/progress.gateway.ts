import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IDeleteStatus, IDeployStatus } from 'src/enums';

@WebSocketGateway({ cors: '*' })
export class ProgressGateway {
  @WebSocketServer() server: Server;

  emitDeployStatus(status: IDeployStatus) {
    this.server.emit('progress-deploy-mini-back', status);
  }

  emitDeleteStatus(status: IDeleteStatus) {
    this.server.emit('progress-delete-mini-back', status);
  }
}
