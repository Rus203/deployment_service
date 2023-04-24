import { Controller, Get } from '@nestjs/common';
import { ServerService } from './server.service';

@Controller('server')
export class ServerController {
  constructor(private serverService: ServerService) {}

  @Get('statistic')
  getStatistic() {
    return this.serverService.getStatus();
  }
}
