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
import { GetMiniBackDto } from './dto/get-mini-back.dto';
import { CreateMiniBackDto } from './dto/create-mini-back.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/configs';
import { FindOneParams } from './dto/find-one-param.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from 'src/user/user.entity';

@ApiBearerAuth()
@Controller('mini-back')
export class MiniBackController {
  constructor(private miniBackService: MiniBackService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(dto: GetMiniBackDto, @Req() req: Request & { user: User }) {
    return await this.miniBackService.getAll({ ...dto, userId: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(dto: GetMiniBackDto) {
    return await this.miniBackService.getOne(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'sshServerPrivateKey' }], { storage }),
  )
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

  @Post('deploy/:id')
  async deployMiniBack(@Param() dto: FindOneParams) {
    const id = dto.id;
    return await this.miniBackService.placeMiniBake(id);
  }

  @Delete(':id')
  async delete(@Param() dto: FindOneParams) {
    const id = dto.id;
    await this.miniBackService.delete(id);
  }
}
