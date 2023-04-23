import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { probe } from '@network-utils/tcp-ping';
import path from 'path';
import { FileEncryptorProvider } from '../file-encryptor/file-encryptor.provider';
import { SshProvider } from '../ssh/ssh.provider';
import fs from 'fs';

interface IMiniBack {
  sshServerPrivateKeyPath: string;
  serverUrl: string;
  gitProjectLink?: string;
}

@Injectable()
export class MiniBackProvider {
  nameRemoteRepository = 'project';
  constructor(
    private sshProvider: SshProvider,
    private fileEncryptorProvider: FileEncryptorProvider,
  ) {}

  async placeMiniBake({
    gitProjectLink,
    serverUrl,
    sshServerPrivateKeyPath,
  }: IMiniBack) {
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
        this.nameRemoteRepository,
      );

      // pull mini back from github repo
      await this.sshProvider.pullMiniBack(
        {
          sshLink: serverUrl,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        this.nameRemoteRepository,
        gitProjectLink,
      );

      await this.sshProvider.runMiniBack(
        {
          sshLink: serverUrl,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        this.nameRemoteRepository,
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

  async pingMiniBack(serverUrl: string) {
    const miniBackUrl = serverUrl.split('@').at(1);
    return await probe(1001, miniBackUrl);
  }

  async delete({ sshServerPrivateKeyPath, serverUrl }: IMiniBack) {
    try {
      await this.fileEncryptorProvider.decryptFilesOnPlace([
        sshServerPrivateKeyPath,
      ]);
      sshServerPrivateKeyPath = sshServerPrivateKeyPath.replace(/.enc$/, '');

      this.sshProvider.deleteMiniBack(
        {
          sshLink: serverUrl,
          pathToSSHPrivateKey: sshServerPrivateKeyPath,
        },
        this.nameRemoteRepository,
      );
    } catch (error) {
    } finally {
      await this.fileEncryptorProvider.encryptFilesOnPlace(
        sshServerPrivateKeyPath.replace(/.enc$/, ''),
      );
    }
  }
}
