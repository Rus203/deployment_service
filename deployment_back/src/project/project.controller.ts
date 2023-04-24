import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
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
      [{ name: 'envFile' }, { name: 'sshGitPrivateKeyProject' }],
      { storage },
    ),
  )
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles()
    {
      envFile,
      sshGitPrivateKeyProject,
    }: {
      envFile?: Express.Multer.File[];
      sshGitPrivateKeyProject?: Express.Multer.File[];
    },
  ) {
    return await this.projectService.create(
      createProjectDto,
      envFile[0].path,
      sshGitPrivateKeyProject[0].path,
    );
  }

  @Get()
  findAll(@Param() getProjectDto: GetProjectDto) {
    return this.projectService.findAll(getProjectDto);
  }

  @Post('/deploy/:id')
  async deployProject(@Param('id') id: string) {
    console.log(id);
    return await this.projectService.deployProject(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
