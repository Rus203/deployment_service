import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../project/project.entity';
import { Repository } from 'typeorm';
import { GetProjectDto } from './dto/get-project.dto';
import { normalizeProjectName } from 'src/utils';
import { FileEncryptorProvider } from '../file-encryptor/file-encryptor.provider';
import fs from 'fs/promises';
import { UpdateProjectDto } from './dto/update-project.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private fileEncryptorProvider: FileEncryptorProvider,
    private readonly httpService: HttpService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    envFilePath: string,
    sshGitPrivateKeyProjectPath: string,
  ) {
    const candidate = await this.findAll({
      miniBackId: createProjectDto.miniBackId,
      name: createProjectDto.name,
    });

    if (candidate.length > 0) {
      throw new ConflictException('Try to make name of a project unique');
    }

    createProjectDto.name = normalizeProjectName(createProjectDto.name);

    await this.fileEncryptorProvider.encryptFilesOnPlace([
      sshGitPrivateKeyProjectPath,
      envFilePath,
    ]);

    sshGitPrivateKeyProjectPath = sshGitPrivateKeyProjectPath + '.enc';
    envFilePath = envFilePath + '.enc';

    const newProject = this.projectRepository.create({
      ...createProjectDto,
      envFilePath,
      sshGitPrivateKeyProjectPath,
    });

    return this.projectRepository.save(newProject);
  }

  async deployProject(id: string) {
    const project = await this.findOne(id);
    if (project === null) {
      throw new NotFoundException('Such project was not found');
    }

    // const body = {};
    // axios.post();
    this.update(project.id, { isDeploy: true });
    return 'success';
  }

  async update(id: string, parameters: UpdateProjectDto) {
    const project = await this.findOne(id);
    if (project === null) {
      throw new NotFoundException('Such a project was not found');
    }

    this.projectRepository.update({ id }, parameters);
  }

  async findAll(getProjectDto: GetProjectDto) {
    return this.projectRepository.findBy(getProjectDto);
  }

  async findOne(id: string) {
    return this.projectRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    if (project === null) {
      throw new NotFoundException('Not found such a project');
    }

    await fs.unlink(project.envFilePath);
    await fs.unlink(project.sshGitPrivateKeyProjectPath);

    return this.projectRepository.delete({ id });
  }
}
