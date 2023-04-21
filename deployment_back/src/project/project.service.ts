import { Injectable } from '@nestjs/common';
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

  async deploy(id: string) {
    const project = await this.projectRepository.findOneBy({ id });
    const rootDirectory = path.join(__dirname, '..', '..');

    let miniBackPrivateKey = path.join(
      rootDirectory,
      'mini-back-key',
      'id_rsa.enc',
    );

    let serverPrivateKey = project.sshServerPrivateKeyPath;

    await this.fileEncryptorProvider.decryptFilesOnPlace([
      miniBackPrivateKey,
      serverPrivateKey,
    ]);

    miniBackPrivateKey = miniBackPrivateKey.replace(/.enc$/, '');
    serverPrivateKey = serverPrivateKey.replace(/.enc$/, '');

    await this.sshProvider.putDirectoryToRemoteServer(
      {
        sshLink: project.serverUrl,
        pathToSSHPrivateKey: serverPrivateKey,
      },
      path.join(rootDirectory, 'mini-back-key'),
      '/root/mini_back',
    );

    console.log('check mini_back');
    await this.fileEncryptorProvider.encryptFilesOnPlace(
      [miniBackPrivateKey, serverPrivateKey].map((path) =>
        path.replace(/.enc$/, ''),
      ),
    );

    return 'ok';
  }
}
