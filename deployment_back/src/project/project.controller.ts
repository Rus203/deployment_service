import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/configs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'envFile' },
        { name: 'sshServerPrivateKey' },
        { name: 'sshGitPrivateKeyProject' },
        { name: 'sshGitPublicKeyProject' },
      ],
      { storage },
    ),
  )
  async create(
    @Req() req,
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles()
    {
      envFile,
      sshServerPrivateKey,
      sshGitPrivateKeyProject,
      sshGitPublicKeyProject,
    }: {
      envFile?: Express.Multer.File[];
      sshServerPrivateKey?: Express.Multer.File[];
      sshGitPrivateKeyProject?: Express.Multer.File[];
      sshGitPublicKeyProject?: Express.Multer.File[];
    },
  ) {
    const owner = req.user;
    return await this.projectService.create(
      createProjectDto,
      envFile[0].path,
      sshServerPrivateKey[0].path,
      sshGitPrivateKeyProject[0].path,
      sshGitPublicKeyProject[0].path,
      owner,
    );
  }

  @Get()
  findAll(@Param() getProjectDto: GetProjectDto) {
    return this.projectService.findAll(getProjectDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
  //   return this.projectService.update(id, updateProjectDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
