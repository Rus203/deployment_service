import {
  Controller,
  Post,
  Get,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Param,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { MiniBackService } from './mini-back.service';
import { CreateMiniBackDto } from './dto/create-mini-back.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/configs';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from 'src/user/user.entity';

@ApiTags('mini-back')
@Controller('mini-back')
export class MiniBackController {
  constructor(private miniBackService: MiniBackService) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiBearerAuth()
  @Get()
  async getAll(@Req() req: Request & { user: User }) {
    return await this.miniBackService.getAll(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiBearerAuth()
  @Get(':id')
  async getOne(@Param('id') id: string, @Req() req: Request & { user: User }) {
    return await this.miniBackService.getOne({ id, userId: req.user.id });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The instance of mini back not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'serverUrl', 'sshServerPrivateKey'],
      properties: {
        name: {
          type: 'string',
        },

        sshConnectionString: {
          type: 'string',
        },

        sshServerPrivateKey: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'sshServerPrivateKey' }], { storage }),
  )
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() dto: CreateMiniBackDto,
    @Req() req: Request & { user: User },
    @UploadedFiles()
    { sshServerPrivateKey }: { sshServerPrivateKey?: Express.Multer.File[] },
  ) {
    const sshServerPrivateKeyPath = sshServerPrivateKey[0].path;
    const userId = req.user.id;
    return await this.miniBackService.create({
      ...dto,
      userId,
      sshServerPrivateKeyPath,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiNotFoundResponse({ description: 'The instance of mini back not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('deploy/:id')
  async deployMiniBack(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ) {
    return await this.miniBackService.placeMiniBake({
      id,
      userId: req.user.id,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The instance of mini back not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request & { user: User }) {
    await this.miniBackService.delete({ id, userId: req.user.id });
  }
}
