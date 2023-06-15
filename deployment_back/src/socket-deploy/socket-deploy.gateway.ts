import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UseGuards } from '@nestjs/common';
import { MiniBackService } from 'src/mini-back/mini-back.service';
import { GetMiniBackDto } from 'src/mini-back/dto/get-mini-back.dto';
import { AuthGuard } from './socket-deploy.guard';

// find out how to use only one instance if socket io

@Injectable()
@WebSocketGateway({ cors: '*' })
export class SocketDeployGateway {
  constructor(private miniBackService: MiniBackService) {}
  @WebSocketServer() server: Server;

  @UseGuards(AuthGuard)
  @SubscribeMessage('deploy-miniback')
  async runDeploy(
    @MessageBody() dto: GetMiniBackDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.miniBackService
      .placeMiniBake({ ...dto, userId: client.data.payload.id })
      .then(() => {
        this.server.emit(`finish-deploy-mini-back-${dto.id}`);
      })
      .catch((error) => {
        this.server.emit(`error-${dto.id}`, error.message);
      });
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('delete-miniback')
  async deleteMiniback(
    @MessageBody() dto: GetMiniBackDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.miniBackService
      .delete({ ...dto, userId: client.data.payload.id })
      .then(() => {
        this.server.emit(`finish-delete-mini-back-${dto.id}`);
      })
      .catch((error) => {
        this.server.emit(`error-${dto.id}`, error.message);
      });
  }
}
