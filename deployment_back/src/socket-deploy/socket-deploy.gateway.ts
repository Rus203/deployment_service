import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, UseGuards } from '@nestjs/common';
import { MiniBackService } from 'src/mini-back/mini-back.service';
import { GetMiniBackDto } from 'src/mini-back/dto/get-mini-back.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthGuard } from './socket-deploy.guard';
import { Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: '*' })
export class SocketDeployGateway {
  constructor(private miniBackService: MiniBackService) {}
  @WebSocketServer() server: Server;

  @UseGuards(AuthGuard)
  @SubscribeMessage('deploy-project')
  async runDeploy(
    @MessageBody() dto: GetMiniBackDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.miniBackService
      .placeMiniBake({ ...dto, userId: client.data.payload.id })
      .then(() => {
        this.server.emit('finish-deploy');
      })
      .catch((error) => {
        this.server.emit('error', error.message);
      });
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('delete-project')
  async deleteMiniback(
    @MessageBody() dto: GetMiniBackDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('start deleting');
    this.miniBackService
      .delete({ ...dto, userId: client.data.payload.id })
      .then(() => {
        this.server.emit('finish-delete');
      })
      .catch((error) => {
        console.log(error);
        this.server.emit('error', error.message);
      });
  }
}
