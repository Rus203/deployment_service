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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/configs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiConflictResponse({ description: 'Try to make name of a project unique' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'email',
        'sshGitPrivateKeyProject',
        'gitProjectLink',
        'port',
        'miniBackId',
        'envFile',
      ],
      properties: {
        name: {
          type: 'string',
        },

        email: {
          type: 'string',
        },

        gitProjectLink: {
          type: 'string',
        },

        port: {
          type: 'number',
        },

        miniBackId: {
          type: 'string',
          format: 'UUID',
        },

        sshGitPrivateKeyProject: {
          type: 'file',
          format: 'binary',
        },

        envFile: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiNotFoundResponse({ description: 'Such a project was not found' })
  @Post('/deploy/:id')
  async deployProject(@Param('id') id: string) {
    console.log(id);
    return await this.projectService.deployProject(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('run')
  async runProject() {
    return await this.projectService.runProjectOnServer();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('stop')
  async stopProject() {
    return await this.projectService.stopProjectOnServer();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Get('by_mini_back/:miniBackId')
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  findAll(@Param('miniBackId') miniBackId: string) {
    return this.projectService.findAll({ miniBackId });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiNotFoundResponse({ description: 'Such a project was not found' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
