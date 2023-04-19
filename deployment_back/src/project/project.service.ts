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
import * as path from 'path';
import * as fs from 'fs/promises';

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
    const newProject = this.projectRepository.create({
      ...createProjectDto,
      envFilePath,
      sshServerPrivateKeyPath,
      sshGitPrivateKeyProjectPath,
      sshGitPublicKeyProjectPath,
      userId: owner.id,
    });

    await this.fileEncryptorProvider.encryptFilesOnPlace([
      sshServerPrivateKeyPath,
      sshGitPrivateKeyProjectPath,
      sshGitPublicKeyProjectPath,
      envFilePath,
    ]);

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
    console.log(project);
    const rootDirectory = path.join(__dirname, '..', '..');

    // await this.fileEncryptorProvider.decryptFilesOnPlace([sshFile, envFile]);
    // const envFileContent = await fs.readFile(envFile.replace(/.enc$/, ''));
    // await fs.writeFile(path.join(project.uploadPath, '.env'), envFileContent);

    const miniBackPrivateKey = path.join(
      rootDirectory,
      'mini-back-keys',
      'id_rsa',
    );

    const miniBackPublicKey = path.join(
      rootDirectory,
      'mini-back-keys',
      'id_rsa.pub',
    );

    await this.fileEncryptorProvider.decryptFilesOnPlace([
      miniBackPublicKey,
      miniBackPrivateKey,
    ]);

    miniBackPublicKey.replace(/.enc$/, '');
    miniBackPrivateKey.replace(/.enc$/, '');

    await this.sshProvider.putDirectoryToRemoteServer(
      {
        sshLink: project.serverUrl,
        pathToSSHPrivateKey: project.sshServerPrivateKeyPath,
      },
      path.join(rootDirectory, 'mini-back-keys'),
      '.',
    );

    console.log('check mini_back');
    await this.fileEncryptorProvider.encryptFilesOnPlace(
      [miniBackPublicKey, miniBackPrivateKey].map((path) =>
        path.replace(/.enc$/, ''),
      ),
    );

    // await this.sshProvider.putDirectoryToRemoteServer(
    //   {
    //     sshLink: project.sshServerUrl,
    //     pathToSSHPrivateKey: project.sshFile,
    //   },
    //   project.uploadPath,
    //   'mini_back/project',
    // );

    // console.log('MiniBack placed');

    // await this.sshProvider.runMiniBack(
    //   {
    //     sshLink: project.sshServerUrl,
    //     pathToSSHPrivateKey: project.sshFile,
    //   },
    //   'mini_back',
    // );

    // console.log('MiniBack runned');

    return 'ok';
  }
}
