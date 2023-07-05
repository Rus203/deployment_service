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
import { DeleteStatus, DeployStatus, MiniBackState } from '../enums';
import { chmodSync, existsSync } from 'fs';
import { SocketProgressGateway } from '../socket-progress/socket-progress.gateway';
import { makeCopyFile } from '../utils/make-copy-file';

@Injectable()
export class MiniBackService implements OnApplicationBootstrap {
  rootDirectory = join(__dirname, '..', '..');
  constructor(
    private sshProvider: SshProvider,
    private fileEncryptorProvider: FileEncryptorProvider,
    @InjectRepository(MiniBack)
    private miniBackRepository: Repository<MiniBack>,
    private socket: SocketProgressGateway,
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
        envFilePath,
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
      envFilePath: string;
      userId: string;
    },
  ) {
    const [userName, serverUrl] = dto.sshConnectionString.split('@');
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
      dto.envFilePath,
    ]);

    dto.sshServerPrivateKeyPath = dto.sshServerPrivateKeyPath + '.enc';
    dto.envFilePath = dto.envFilePath + '.enc';

    const instance = this.miniBackRepository.create({
      ...dto,
      port,
      serverUrl,
      userName,
    });
    const {
      sshServerPrivateKeyPath,
      nameRemoteRepository,
      sshConnectionString,
      envFilePath,
      ...rest
    } = await this.miniBackRepository.save({
      ...instance,
      nameRemoteRepository: process.env.REMOTE_REPOSITORY,
    });
    return rest;
  }

  async delete(dto: GetMiniBackDto) {
    const currentMiniBack = await this.getOne(dto);
    if (currentMiniBack === null) {
      throw new Error('The instance of mini back not found');
    }

    this.socket.emitDeleteStatus(DeleteStatus.START, currentMiniBack.id);

    try {
      if (currentMiniBack.deployState === MiniBackState.DEPLOYED) {
        await this.deleteMiniBackFromServer(currentMiniBack);
      }
    } catch (error) {
      throw error;
    } finally {
      await this.miniBackRepository.delete({ id: dto.id });
      if (existsSync(currentMiniBack.sshServerPrivateKeyPath)) {
        fs.unlink(currentMiniBack.sshServerPrivateKeyPath);
      }

      if (existsSync(currentMiniBack.envFilePath)) {
        fs.unlink(currentMiniBack.envFilePath);
      }

      this.socket.emitDeleteStatus(DeleteStatus.FINISH, currentMiniBack.id);
    }
  }

  async placeMiniBake(dto: GetMiniBackDto) {
    const currentMiniBack = await this.getOne(dto);
    if (currentMiniBack === null) {
      throw new Error('Nof found the instance of mini back');
    }

    this.socket.emitDeployStatus(DeployStatus.START, currentMiniBack.id);
    const deployState = currentMiniBack.deployState;
    if (deployState !== MiniBackState.UNDEPLOYED) {
      throw new Error(
        'This instance of mini_back has already either developed or failed via you are not able to do it',
      );
    }

    // eslint-disable-next-line prefer-const
    const {
      sshConnectionString,
      sshServerPrivateKeyPath,
      nameRemoteRepository,
      envFilePath,
    } = currentMiniBack;
    const gitProjectLink = process.env.GIT_MINI_BACK_LINK;

    const miniBackPrivateKey = join(
      this.rootDirectory,
      'mini-back-key',
      'id_rsa.enc',
    );

    if (!existsSync(miniBackPrivateKey)) {
      throw new Error("Secret key of mini back wasn't provided");
    }

    let tempMiniBackPrivateKeyPath = await makeCopyFile(miniBackPrivateKey);
    let tempSshFilePrivateKeyPath = await makeCopyFile(sshServerPrivateKeyPath);
    let tempEnvFilePath = await makeCopyFile(envFilePath);

    await this.fileEncryptorProvider.decryptFilesOnPlace([
      tempMiniBackPrivateKeyPath,
      tempSshFilePrivateKeyPath,
      tempEnvFilePath,
    ]);

    tempSshFilePrivateKeyPath = tempSshFilePrivateKeyPath.replace(/.enc$/, '');
    tempEnvFilePath = tempEnvFilePath.replace(/.enc$/, '');
    tempMiniBackPrivateKeyPath = tempMiniBackPrivateKeyPath.replace(
      /.enc$/,
      '',
    );

    chmodSync(tempMiniBackPrivateKeyPath, 0o600);

    this.socket.emitDeployStatus(DeployStatus.PREPARING, currentMiniBack.id);
    try {
      this.socket.emitDeployStatus(
        DeployStatus.CHECK_CONNECTION,
        currentMiniBack.id,
      );

      await this.sshProvider.testSshConnection({
        pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        userName: currentMiniBack.userName,
        serverUrl: currentMiniBack.serverUrl,
      });

      // place the private key of mini back
      await this.sshProvider.putDirectoryToRemoteServer(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        join(this.rootDirectory, 'mini-back-configs'),
        nameRemoteRepository,
      );

      this.socket.emitDeployStatus(
        DeployStatus.PUT_DIRECTORY,
        currentMiniBack.id,
      );

      await this.sshProvider.putFileInDir(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        tempMiniBackPrivateKeyPath,
        join(`${nameRemoteRepository}`, 'id_rsa'),
      );

      this.socket.emitDeployStatus(DeployStatus.PUT_KEY, currentMiniBack.id);

      // pull docker
      await this.sshProvider.pullDocker(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        nameRemoteRepository,
      );

      this.socket.emitDeployStatus(
        DeployStatus.PULL_DOCKER,
        currentMiniBack.id,
      );

      // pull mini back from github repo
      await this.sshProvider.pullMiniBack(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        nameRemoteRepository,
        gitProjectLink,
      );

      this.socket.emitDeployStatus(
        DeployStatus.PULL_MINIBACK,
        currentMiniBack.id,
      );

      await this.sshProvider.putFileInDir(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        tempEnvFilePath,
        join(`${nameRemoteRepository}`, 'mini-back', '.env'),
      );

      this.socket.emitDeployStatus(DeployStatus.PUT_ENV, currentMiniBack.id);

      await this.sshProvider.runMiniBack(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        nameRemoteRepository,
      );

      this.socket.emitDeployStatus(
        DeployStatus.RUN_MINIBACK,
        currentMiniBack.id,
      );

      await this.miniBackRepository.update(
        { id: currentMiniBack.id },
        { deployState: MiniBackState.DEPLOYED },
      );

      this.socket.emitDeployStatus(
        DeployStatus.UPDATE_STATUS,
        currentMiniBack.id,
      );
    } catch (error: any) {
      await this.miniBackRepository.update(
        { id: currentMiniBack.id },
        { deployState: MiniBackState.FAILED },
      );

      console.log(error);
      if (typeof error === 'string') {
        throw new Error(error);
      }

      throw error;
    } finally {
      if (existsSync(tempSshFilePrivateKeyPath)) {
        fs.unlink(tempSshFilePrivateKeyPath);
      }

      if (existsSync(tempEnvFilePath)) {
        fs.unlink(tempEnvFilePath);
      }

      if (existsSync(tempMiniBackPrivateKeyPath)) {
        fs.unlink(tempMiniBackPrivateKeyPath);
      }

      this.socket.emitDeployStatus(DeployStatus.FINISH, currentMiniBack.id);
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

      this.socket.emitDeleteStatus(DeleteStatus.PREPARING, currentMiniBack.id);

      await this.sshProvider.testSshConnection({
        pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        userName: currentMiniBack.userName,
        serverUrl: currentMiniBack.serverUrl,
      });

      this.socket.emitDeleteStatus(
        DeleteStatus.CHECK_CONNECTION,
        currentMiniBack.id,
      );

      await this.sshProvider.deleteMiniBack(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: tempSshFilePrivateKeyPath,
        },
        nameRemoteRepository,
      );

      this.socket.emitDeleteStatus(DeleteStatus.DELETING, currentMiniBack.id);
    } catch (error: any) {
      throw error;
    } finally {
      if (existsSync(tempSshFilePrivateKeyPath)) {
        fs.unlink(tempSshFilePrivateKeyPath);
      }
    }
  }
}
