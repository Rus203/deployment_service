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
        [
          '-i',
          pathToSSHPrivateKey,
          '-o StrictHostKeyChecking=no',
          '-r',
          localDirectory,
          remoteFullPath,
        ],
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

  public pullMiniBack(
    { sshLink, pathToSSHPrivateKey }: ISshConnectionOptions,
    nameRemoteRepository: string,
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
          `"sudo ~/${nameRemoteRepository}/pull-mini-back.script.sh ${gitProjectLink} ${nameRemoteRepository}"`,
        ],
        {
          shell: true,
        },
      );

      this.handleProcessErrors(childProcess, resolve, reject);
    });
  }

  runMiniBack(
    { sshLink, pathToSSHPrivateKey }: ISshConnectionOptions,
    nameRemoteRepository: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(
        'ssh',
        [
          '-T',
          sshLink,
          '-i',
          pathToSSHPrivateKey,
          `"sudo ~/${nameRemoteRepository}/run-mini-back.script.sh ${nameRemoteRepository}"`,
        ],
        {
          shell: true,
        },
      );

      this.handleProcessErrors(childProcess, resolve, reject);
    });
  }

  deleteMiniBack(
    { sshLink, pathToSSHPrivateKey }: ISshConnectionOptions,
    nameRemoteRepository: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(
        'ssh',
        [
          '-T',
          sshLink,
          '-i',
          pathToSSHPrivateKey,
          `"sudo ~/${nameRemoteRepository}/delete-mini-back.script.sh ${nameRemoteRepository}"`,
        ],
        {
          shell: true,
        },
      );

      this.handleProcessErrors(childProcess, resolve, reject);
    });
  }

  pullDocker(
    { sshLink, pathToSSHPrivateKey }: ISshConnectionOptions,
    nameRemoteRepository: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(
        'ssh',
        [
          '-T',
          sshLink,
          '-i',
          pathToSSHPrivateKey,
          `"sudo ~/${nameRemoteRepository}/pull-docker.script.sh"`,
        ],
        {
          shell: true,
        },
      );

      this.handleProcessErrors(childProcess, resolve, reject);
    });
  }
}
