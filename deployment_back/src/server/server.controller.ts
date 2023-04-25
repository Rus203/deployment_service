import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ServerService } from './server.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('server')
@Controller('server')
export class ServerController {
  constructor(private serverService: ServerService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({
    description: 'This instance of mini_back has already places',
  })
  @ApiNotFoundResponse({ description: 'The instance of mini back not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('deploy/:id')
  @Get('statistic')
  getStatistic() {
    return this.serverService.getStatus();
  }
}
