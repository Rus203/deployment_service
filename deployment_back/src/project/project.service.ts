import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../project/project.entity';
import { Repository } from 'typeorm';
import { GetProjectDto } from './dto/get-project.dto';
import { User } from 'src/user/user.entity';
import { normalizeProjectName } from 'src/utils';
import { SshProvider } from 'src/ssh/ssh.provider';
import { FileEncryptorProvider } from '../file-encryptor/file-encryptor.provider';
import { MiniBackProvider } from 'src/mini-back/mini-back.provider';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private sshProvider: SshProvider,
    private fileEncryptorProvider: FileEncryptorProvider,
    private miniBackProvider: MiniBackProvider,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    envFilePath: string,
    sshServerPrivateKeyPath: string,
    sshGitPrivateKeyProjectPath: string,
    sshGitPublicKeyProjectPath: string,
    owner: User,
  ) {
    createProjectDto.name = normalizeProjectName(createProjectDto.name);

    await this.fileEncryptorProvider.encryptFilesOnPlace([
      sshServerPrivateKeyPath,
      sshGitPrivateKeyProjectPath,
      sshGitPublicKeyProjectPath,
      envFilePath,
    ]);

    sshServerPrivateKeyPath = sshServerPrivateKeyPath + '.enc';
    sshGitPrivateKeyProjectPath = sshGitPrivateKeyProjectPath + '.enc';
    sshGitPublicKeyProjectPath = sshGitPublicKeyProjectPath + '.enc';
    envFilePath = envFilePath + '.enc';

    const newProject = this.projectRepository.create({
      ...createProjectDto,
      envFilePath,
      sshServerPrivateKeyPath,
      sshGitPrivateKeyProjectPath,
      sshGitPublicKeyProjectPath,
      userId: owner.id,
    });

    return this.projectRepository.save(newProject);
  }

  async deploy(projectId: string) {
    const project = await this.findOne(projectId);

    if (project === null) {
      throw new NotFoundException("That project was't found");
    }

    const status = await this.miniBackProvider.pingMiniBack(project.serverUrl);

    if (!status) {
      const { serverUrl, sshServerPrivateKeyPath, gitProjectLink } = project;
      await this.miniBackProvider.placeMiniBake({
        serverUrl,
        sshServerPrivateKeyPath,
        gitProjectLink,
      });
    }

    return 'success';
  }

  async findAll(getProjectDto: GetProjectDto) {
    return this.projectRepository.findBy(getProjectDto);
  }

  findOne(id: string) {
    return this.projectRepository.findOneBy({ id });
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    throw new Error('not implement yet');
  }

  remove(id: string) {
    return this.projectRepository.delete({ id });
  }
}
