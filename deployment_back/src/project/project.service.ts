import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
import path from 'path';
import fs from 'fs';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private sshProvider: SshProvider,
    private fileEncryptorProvider: FileEncryptorProvider,
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

  async placeMiniBakeByProjectId(id: string) {
    const rootDirectory = path.join(__dirname, '..', '..');
    const project = await this.projectRepository.findOneBy({ id });

    if (project === null) {
      throw new NotFoundException("That project was't found");
    }

    let miniBackPrivateKey = path.join(
      rootDirectory,
      'mini-back-key',
      'id_rsa.enc',
    );

    if (!fs.existsSync(miniBackPrivateKey)) {
      throw new InternalServerErrorException(
        "Secret key of mini back wasn't provide",
      );
    }

    let sshServerPrivateKeyPath = project.sshServerPrivateKeyPath;

    await this.fileEncryptorProvider.decryptFilesOnPlace([
      miniBackPrivateKey,
      sshServerPrivateKeyPath,
    ]);

    miniBackPrivateKey = miniBackPrivateKey.replace(/.enc$/, '');
    sshServerPrivateKeyPath = sshServerPrivateKeyPath.replace(/.enc$/, '');

    const nameRemoteRepository = 'project';
    try {
      // place the private key of mini back
      await this.sshProvider.putDirectoryToRemoteServer(
        {
          sshLink: project.serverUrl,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        path.join(rootDirectory, 'mini-back-key'),
        nameRemoteRepository,
      );

      // pull mini back from github repo
      await this.sshProvider.pullMiniBack(
        {
          sshLink: project.serverUrl,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        nameRemoteRepository,
        project.gitProjectLink,
      );

      await this.sshProvider.runMiniBack(
        {
          sshLink: project.serverUrl,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        nameRemoteRepository,
      );
    } catch {
      throw new BadRequestException(
        'Set up private key, url of mini back and ssh git link correctly',
      );
    } finally {
      await this.fileEncryptorProvider.encryptFilesOnPlace(
        [miniBackPrivateKey, sshServerPrivateKeyPath].map((path) =>
          path.replace(/.enc$/, ''),
        ),
      );
    }

    return 'success';
  }
}
