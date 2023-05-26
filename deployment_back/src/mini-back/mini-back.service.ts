import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import path from 'path';
import { FileEncryptorProvider } from '../file-encryptor/file-encryptor.provider';
import { SshProvider } from '../ssh/ssh.provider';
import fs from 'fs/promises';
import { MiniBack } from './mini-back.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMiniBackDto } from './dto/get-mini-back.dto';
import { CreateMiniBackDto } from './dto/create-mini-back.dto';
import { ProjectState, normalizeProjectName } from 'src/utils';
import { chmodSync } from 'fs';

@Injectable()
export class MiniBackService implements OnApplicationBootstrap {
  rootDirectory = path.join(__dirname, '..', '..');
  constructor(
    private sshProvider: SshProvider,
    private fileEncryptorProvider: FileEncryptorProvider,
    @InjectRepository(MiniBack)
    private miniBackRepository: Repository<MiniBack>,
  ) {}

  async onApplicationBootstrap() {
    const commonPath = path.join(this.rootDirectory, 'mini-back-configs');
    const files = await fs.readdir(commonPath);

    files.forEach((file) => {
      if (file.endsWith('.sh')) {
        chmodSync(path.join(commonPath, file), 0o601);
      }
    });
  }

  async getAll(userId: string) {
    return await this.miniBackRepository.find({ where: { userId } });
  }

  async getOne(dto: GetMiniBackDto & { serverUrl?: string }) {
    return this.miniBackRepository.findOne({ where: dto });
  }

  async create(
    dto: CreateMiniBackDto & {
      sshServerPrivateKeyPath: string;
      userId: string;
    },
  ) {
    const serverUrl = dto.sshConnectionString.split('@')[1];
    const candidate = await this.getOne({ userId: dto.userId, serverUrl });

    if (candidate !== null) {
      throw new BadRequestException('This server is already busy');
    }

    dto.port = Number(process.env.MINI_BACK_PORT);
    dto.name = normalizeProjectName(dto.name);
    await this.fileEncryptorProvider.encryptFilesOnPlace([
      dto.sshServerPrivateKeyPath,
    ]);

    dto.sshServerPrivateKeyPath = dto.sshServerPrivateKeyPath + '.enc';
    const instance = this.miniBackRepository.create({ ...dto, serverUrl });
    const nameRemoteRepository = process.env.REMOTE_REPOSITORY;
    return this.miniBackRepository.save({ ...instance, nameRemoteRepository });
  }

  async delete(dto: GetMiniBackDto) {
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
      await fs
        .unlink(currentMiniBack.sshServerPrivateKeyPath)
        .catch((error) => {
          console.log(error);
        });
      await this.miniBackRepository.delete(dto);
    }
  }

  async placeMiniBake(dto: GetMiniBackDto) {
    const currentMiniBack = await this.getOne(dto);
    if (currentMiniBack === null) {
      throw new Error('Nof found the instance of mini back');
    }

    const deployState = currentMiniBack.deployState;
    if (deployState === ProjectState.DEPLOYED) {
      throw new Error(
        'This instance of mini_back has already either developed or failed via you are not able to do it',
      );
    }

    // eslint-disable-next-line prefer-const
    let { sshConnectionString, sshServerPrivateKeyPath, nameRemoteRepository } =
      currentMiniBack;
    const gitProjectLink = process.env.GIT_MINI_BACK_LINK;

    let miniBackPrivateKey = path.join(
      this.rootDirectory,
      'mini-back-configs',
      'id_rsa.enc',
    );

    if (!fs.access(miniBackPrivateKey)) {
      throw new Error("Secret key of mini back wasn't provided");
    }

    await this.fileEncryptorProvider.decryptFilesOnPlace([
      miniBackPrivateKey,
      sshServerPrivateKeyPath,
    ]);

    miniBackPrivateKey = miniBackPrivateKey.replace(/.enc$/, '');
    sshServerPrivateKeyPath = sshServerPrivateKeyPath.replace(/.enc$/, '');

    try {
      // place the private key of mini back
      await this.sshProvider.putDirectoryToRemoteServer(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        path.join(this.rootDirectory, 'mini-back-configs'),
        nameRemoteRepository,
      );

      // pull mini back from github repo
      await this.sshProvider.pullMiniBack(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        nameRemoteRepository,
        gitProjectLink,
      );

      await this.sshProvider.runMiniBack(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        nameRemoteRepository,
      );

      await this.miniBackRepository.update(
        { id: currentMiniBack.id },
        { deployState: ProjectState.DEPLOYED },
      );
    } catch (error: any) {
      await this.miniBackRepository.update(
        { id: currentMiniBack.id },
        { deployState: ProjectState.FAILED },
      );

      throw error;
    } finally {
      await this.fileEncryptorProvider.encryptFilesOnPlace(
        [miniBackPrivateKey, sshServerPrivateKeyPath].map((path) =>
          path.replace(/.enc$/, ''),
        ),
      );
    }
  }

  async deleteMiniBackFromServer(currentMiniBack: MiniBack) {
    // eslint-disable-next-line prefer-const
    let { sshServerPrivateKeyPath, sshConnectionString, nameRemoteRepository } =
      currentMiniBack;
    try {
      await this.fileEncryptorProvider.decryptFilesOnPlace([
        sshServerPrivateKeyPath,
      ]);
      sshServerPrivateKeyPath = sshServerPrivateKeyPath.replace(/.enc$/, '');

      await this.sshProvider.deleteMiniBack(
        {
          sshLink: sshConnectionString,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        nameRemoteRepository,
      );
    } catch (error: any) {
      throw error;
    } finally {
      await this.fileEncryptorProvider.encryptFilesOnPlace(
        sshServerPrivateKeyPath.replace(/.enc$/, ''),
      );
    }
  }
}
