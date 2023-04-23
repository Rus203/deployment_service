import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { probe } from '@network-utils/tcp-ping';
import path from 'path';
import { FileEncryptorProvider } from '../file-encryptor/file-encryptor.provider';
import { SshProvider } from '../ssh/ssh.provider';
import fs from 'fs';
import { MiniBack } from './mini-back.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMiniBackDto } from './dto/get-mini-back.dto';
import { CreateMiniBackDto } from './dto/create-mini-back.dto';
import { normalizeProjectName } from 'src/utils';

@Injectable()
export class MiniBackService {
  // nameRemoteRepository = 'project';
  constructor(
    private sshProvider: SshProvider,
    private fileEncryptorProvider: FileEncryptorProvider,
    @InjectRepository(MiniBack)
    private miniBackRepository: Repository<MiniBack>,
  ) {}

  async getAll(dto: GetMiniBackDto & { userId: string }) {
    return await this.miniBackRepository.find({ where: dto });
  }

  async getOne(dto: GetMiniBackDto) {
    return await this.miniBackRepository.findOneBy(dto);
  }

  async create(
    dto: CreateMiniBackDto & {
      sshServerPrivateKeyPath: string;
      userId: string;
    },
  ) {
    dto.name = normalizeProjectName(dto.name);

    const candidate = await this.getOne({ name: dto.name });

    if (candidate !== null) {
      throw new ConflictException('Such name has already existed');
    }

    await this.fileEncryptorProvider.encryptFilesOnPlace([
      dto.sshServerPrivateKeyPath,
    ]);

    dto.sshServerPrivateKeyPath = dto.sshServerPrivateKeyPath + '.enc';

    const instance = this.miniBackRepository.create(dto);
    const nameRemoteRepository = process.env.REMOTE_REPOSITORY;
    return this.miniBackRepository.save({ ...instance, nameRemoteRepository });
  }

  async delete(id: string) {
    const currentMiniBack = await this.getOne({ id });
    if (currentMiniBack === null) {
      throw new NotFoundException('The instance of mini back not found');
    }

    // const status = await this.pingMiniBack(currentMiniBack.serverUrl);
    try {
      await this.deleteMiniBackFromServer(currentMiniBack);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return this.miniBackRepository.delete({ id });
  }

  async placeMiniBake(id: string) {
    const currentMiniBack = await this.getOne({ id });
    if (currentMiniBack === null) {
      throw new NotFoundException('The instance of mini back not found');
    }

    const status = await this.pingMiniBack(currentMiniBack.serverUrl);
    if (status) {
      throw new BadRequestException(
        'This instance of mini_back has already places',
      );
    }
    // eslint-disable-next-line prefer-const
    let { serverUrl, sshServerPrivateKeyPath, nameRemoteRepository } =
      currentMiniBack;
    const gitProjectLink = process.env.GIT_MINI_BACK_LINK;
    const rootDirectory = path.join(__dirname, '..', '..');

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
          sshLink: serverUrl,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        path.join(rootDirectory, 'mini-back-key'),
        nameRemoteRepository,
      );

      // pull mini back from github repo
      await this.sshProvider.pullMiniBack(
        {
          sshLink: serverUrl,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        nameRemoteRepository,
        gitProjectLink,
      );

      await this.sshProvider.runMiniBack(
        {
          sshLink: serverUrl,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        nameRemoteRepository,
      );
    } catch (error: any) {
      throw new BadRequestException(error);
    } finally {
      await this.fileEncryptorProvider.encryptFilesOnPlace(
        [miniBackPrivateKey, sshServerPrivateKeyPath].map((path) =>
          path.replace(/.enc$/, ''),
        ),
      );
    }

    return 'success';
  }

  async pingMiniBack(serverUrl: string) {
    const miniBackPort = Number(process.env.MINI_BACK_PORT);
    const miniBackUrl = serverUrl.split('@').at(1);
    return await probe(miniBackPort, miniBackUrl);
  }

  async deleteMiniBackFromServer(currentMiniBack: MiniBack) {
    // eslint-disable-next-line prefer-const
    let { sshServerPrivateKeyPath, serverUrl, nameRemoteRepository } =
      currentMiniBack;
    try {
      await this.fileEncryptorProvider.decryptFilesOnPlace([
        sshServerPrivateKeyPath,
      ]);
      sshServerPrivateKeyPath = sshServerPrivateKeyPath.replace(/.enc$/, '');

      await this.sshProvider.deleteMiniBack(
        {
          sshLink: serverUrl,
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
