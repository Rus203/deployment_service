import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { Injectable } from '@nestjs/common';
import { ChildProcessCommandProvider } from 'src/utils';

export interface ISshConnectionOptions {
  sshLink: string;
  pathToSSHPrivateKey: string;
}

@Injectable()
export class SshProvider extends ChildProcessCommandProvider {
  public putDirectoryToRemoteServer(
    { sshLink, pathToSSHPrivateKey }: ISshConnectionOptions,
    localDirectory: string,
    remoteDirectory: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const remoteFullPath = sshLink + ':' + remoteDirectory;

      console.log('sshLink(serverUrl)', sshLink);
      console.log('pathToSSH', pathToSSHPrivateKey);
      console.log('localDirectory', localDirectory);
      console.log('remoteDirectory', remoteDirectory);

      const childProcess = spawn(
        'scp',
        ['-i', pathToSSHPrivateKey, '-r', localDirectory, remoteFullPath],
        {
          shell: true,
        },
      );

      this.handleProcessErrors(childProcess, resolve, reject);
    });
  }

  // don't it need for a while
  public getDirectoryFromRemoteServer(
    { sshLink, pathToSSHPrivateKey }: ISshConnectionOptions,
    localDirectory: string,
    remoteDirectory: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.stat(localDirectory, (err) => {
        if (err) {
          fs.mkdirSync(localDirectory, { recursive: true });
        }

        const remoteFullPath = sshLink + ':' + remoteDirectory;
        const childProcess = spawn(
          'scp',
          ['-i', pathToSSHPrivateKey, '-r', remoteFullPath, localDirectory],
          {
            shell: true,
          },
        );

        this.handleProcessErrors(childProcess, resolve, reject);
      });
    });
  }

  public runMiniBack(
    { sshLink, pathToSSHPrivateKey }: ISshConnectionOptions,
    pathToMiniBack: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(
        'ssh',
        [
          sshLink,
          '-i',
          pathToSSHPrivateKey,
          `"cd ${pathToMiniBack} && npm run npm:install && npm run pm2:start"`,
        ],
        {
          shell: true,
        },
      );

      this.handleProcessErrors(childProcess, resolve, reject);
    });
  }

  deleteMiniBack({
    sshLink,
    pathToSSHPrivateKey,
  }: ISshConnectionOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(
        'ssh',
        [sshLink, '-i', pathToSSHPrivateKey, 'rm -r ~/mini_back'],
        {
          shell: true,
        },
      );

      this.handleProcessErrors(childProcess, resolve, reject);
    });
  }
}
