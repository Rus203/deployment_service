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
    gitProjectLink: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(
        'ssh',
        [
          '-T',
          sshLink,
          '-i',
          pathToSSHPrivateKey,
          'eval $(ssh-agent -s); cd ~/mini_back;' +
            'chmod 600 id_rsa;' +
            'ssh-add id_rsa;' +
            `git clone ${gitProjectLink}`,
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
