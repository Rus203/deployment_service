import {
  ConflictException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { join } from 'path';
import { FileEncryptorProvider } from '../file-encryptor/file-encryptor.provider';
import { SshProvider } from '../ssh/ssh.provider';
import fs from 'fs/promises';
import { MiniBack } from './mini-back.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMiniBackDto } from './dto/get-mini-back.dto';
import { CreateMiniBackDto } from './dto/create-mini-back.dto';
import { normalizeProjectName } from 'src/utils';
import { DeleteStatus, DeployStatus, ProjectState } from '../enums';
import { chmodSync } from 'fs';
import { ProgressGateway } from 'src/socket-progress/progress.gateway';
import { makeCopyFile } from '../utils/make-copy-file';

@Injectable()
export class MiniBackService implements OnApplicationBootstrap {
  rootDirectory = join(__dirname, '..', '..');
  constructor(
    private sshProvider: SshProvider,
    private fileEncryptorProvider: FileEncryptorProvider,
    @InjectRepository(MiniBack)
    private miniBackRepository: Repository<MiniBack>,
    private socket: ProgressGateway,
  ) {}

  async onApplicationBootstrap() {
    const commonPath = join(this.rootDirectory, 'mini-back-configs');
    const files = await fs.readdir(commonPath);

    files.forEach((file) => {
      if (file.endsWith('.sh')) {
        chmodSync(join(commonPath, file), 0o601);
      }
    });
  }

  // returns info without data of mini back files (private key, name of a repo and ssh connection string
  async getAll(userId: string) {
    const miniBackCollection = await this.miniBackRepository.find({
      where: { userId },
    });
    return miniBackCollection.map((instance) => {
      const {
        sshServerPrivateKeyPath,
        nameRemoteRepository,
        sshConnectionString,
        ...rest
      } = instance;
      return rest;
    });
  }

  async getOne(dto: GetMiniBackDto) {
    return this.miniBackRepository.findOne({
      where: dto,
    });
  }

  async create(
    dto: CreateMiniBackDto & {
      sshServerPrivateKeyPath: string;
      userId: string;
    },
  ) {
    const serverUrl = dto.sshConnectionString.split('@')[1];
    const candidate = await this.getOne({
      userId: dto.userId,
      serverUrl,
      sshConnectionString: dto.sshConnectionString,
    });
    const port = Number(process.env.MINI_BACK_PORT);

    if (candidate !== null) {
      throw new ConflictException('This server is already busy');
    }

    dto.name = normalizeProjectName(dto.name);
    await this.fileEncryptorProvider.encryptFilesOnPlace([
      dto.sshServerPrivateKeyPath,
    ]);

    dto.sshServerPrivateKeyPath = dto.sshServerPrivateKeyPath + '.enc';
    const instance = this.miniBackRepository.create({
      ...dto,
      port,
      serverUrl,
    });
    const { sshServerPrivateKeyPath, nameRemoteRepository, ...rest } =
      await this.miniBackRepository.save({
        ...instance,
        nameRemoteRepository: process.env.REMOTE_REPOSITORY,
      });
    return rest;
  }

  async delete(dto: GetMiniBackDto) {
    this.socket.emitDeleteStatus(DeleteStatus.START);
    const currentMiniBack = await this.getOne(dto);
    if (currentMiniBack === null) {
      throw new Error('The instance of mini back not found');
    }

    try {
      if (currentMiniBack.deployState === ProjectState.DEPLOYED) {
        await this.deleteMiniBackFromServer(currentMiniBack);
      }
    } catch (error) {
      throw error;
    } finally {
      await this.miniBackRepository.delete({ id: dto.id });
      if (fs.access(currentMiniBack.sshServerPrivateKeyPath)) {
        await fs.unlink(currentMiniBack.sshServerPrivateKeyPath);
      }
      this.socket.emitDeleteStatus(DeleteStatus.FINISH);
    }
  }

  async placeMiniBake(dto: GetMiniBackDto) {
    this.socket.emitDeployStatus(DeployStatus.START);
    const currentMiniBack = await this.getOne(dto);
    if (currentMiniBack === null) {
      throw new Error('Nof found the instance of mini back');
    }

    const deployState = currentMiniBack.deployState;
    if (deployState !== ProjectState.UNDEPLOYED) {
      throw new Error(
        'This instance of mini_back has already either developed or failed via you are not able to do it',
      );
    }

    // eslint-disable-next-line prefer-const
    let { sshConnectionString, sshServerPrivateKeyPath, nameRemoteRepository } =
      currentMiniBack;
    const gitProjectLink = process.env.GIT_MINI_BACK_LINK;

    const miniBackPrivateKey = join(
      this.rootDirectory,
      'mini-back-key',
      'id_rsa.enc',
    );

    if (!fs.access(miniBackPrivateKey)) {
      throw new Error("Secret key of mini back wasn't provided");
    }

    let tempMiniBackPrivateKeyPath = await makeCopyFile(miniBackPrivateKey);
    let tempSshFilePrivateKeyPath = await makeCopyFile(sshServerPrivateKeyPath);

    await this.fileEncryptorProvider.decryptFilesOnPlace([
      tempMiniBackPrivateKeyPath,
      tempSshFilePrivateKeyPath,
    ]);

    tempSshFilePrivateKeyPath = tempSshFilePrivateKeyPath.replace(/.enc$/, '');
    tempMiniBackPrivateKeyPath = tempMiniBackPrivateKeyPath.replace(
      /.enc$/,
      '',
    );

    chmodSync(tempMiniBackPrivateKeyPath, 0o600);

    this.socket.emitDeployStatus(DeployStatus.PREPARING);
    try {
      // place the private key of mini back
      await this.sshProvider.putDirectoryToRemoteServer(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        join(this.rootDirectory, 'mini-back-configs'),
        nameRemoteRepository,
      );

      this.socket.emitDeployStatus(DeployStatus.PUT_DIRECTORY);

      await this.sshProvider.putFileInDir(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        tempMiniBackPrivateKeyPath,
        join(`${nameRemoteRepository}`, 'id_rsa'),
      );

      this.socket.emitDeployStatus(DeployStatus.PUT_KEY);

      // pull docker
      await this.sshProvider.pullDocker(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        nameRemoteRepository,
      );

      this.socket.emitDeployStatus(DeployStatus.PULL_DOCKER);

      // pull mini back from github repo
      await this.sshProvider.pullMiniBack(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        nameRemoteRepository,
        gitProjectLink,
      );

      this.socket.emitDeployStatus(DeployStatus.PULL_MINIBACK);

      await this.sshProvider.runMiniBack(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        nameRemoteRepository,
      );

      this.socket.emitDeployStatus(DeployStatus.RUN_MINIBACK);

      await this.miniBackRepository.update(
        { id: currentMiniBack.id },
        { deployState: ProjectState.DEPLOYED },
      );

      this.socket.emitDeployStatus(DeployStatus.UPDATE_STATUS);
    } catch (error: any) {
      await this.miniBackRepository.update(
        { id: currentMiniBack.id },
        { deployState: ProjectState.FAILED },
      );

      if (typeof error === 'string') {
        throw new Error(error);
      }

      throw error;
    } finally {
      await this.fileEncryptorProvider.encryptFilesOnPlace(
        tempSshFilePrivateKeyPath,
      );

      if (fs.access(tempMiniBackPrivateKeyPath)) {
        await fs.unlink(tempMiniBackPrivateKeyPath);
      }

      this.socket.emitDeployStatus(DeployStatus.FINISH);
    }
  }

  async deleteMiniBackFromServer(currentMiniBack: MiniBack) {
    // eslint-disable-next-line prefer-const
    let { sshServerPrivateKeyPath, sshConnectionString, nameRemoteRepository } =
      currentMiniBack;

    let tempSshFilePrivateKeyPath = await makeCopyFile(sshServerPrivateKeyPath);

    try {
      await this.fileEncryptorProvider.decryptFilesOnPlace([
        tempSshFilePrivateKeyPath,
      ]);

      tempSshFilePrivateKeyPath = tempSshFilePrivateKeyPath.replace(
        /.enc$/,
        '',
      );

      this.socket.emitDeleteStatus(DeleteStatus.PREPARING);

      await this.sshProvider.deleteMiniBack(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        nameRemoteRepository,
      );

      this.socket.emitDeleteStatus(DeleteStatus.DELETING);
    } catch (error: any) {
      throw error;
    } finally {
      if (fs.access(tempSshFilePrivateKeyPath)) {
        await fs.unlink(tempSshFilePrivateKeyPath);
      }
    }
  }
}
