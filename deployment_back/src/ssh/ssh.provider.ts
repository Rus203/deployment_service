import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { Injectable } from '@nestjs/common';
import { ChildProcessCommandProvider } from 'src/utils';
import { Client } from 'ssh2';

export interface ISshConnectionOptions {
  sshLink: string;
  pathToSSHPrivateKey: string;
}

export interface ISshTestConnection {
  pathToSSHPrivateKey: string;
  userName: string;
  serverUrl: string;
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

  putFileInDir(
    { sshLink, pathToSSHPrivateKey }: ISshConnectionOptions,
    localFilePath: string,
    remoteFilePath: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const childProcess = spawn('scp', [
        '-i',
        pathToSSHPrivateKey,
        '-o StrictHostKeyChecking=no',
        localFilePath,
        `${sshLink}:${remoteFilePath}`,
      ]);

      childProcess.on('error', (error) => {
        reject(error);
      });

      childProcess.on('exit', (code) => {
        if (code === 0) {
          resolve(true);
        } else {
          reject(new Error(`SCP process exited with code ${code}`));
        }
      });

      this.handleProcessErrors(childProcess, resolve, reject);
    });
  }

  testSshConnection({
    pathToSSHPrivateKey,
    userName,
    serverUrl,
  }: ISshTestConnection): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const conn = new Client();

      conn.on('ready', () => {
        conn.end();
        resolve(true);
      });

      conn.on('error', (err) => {
        console.log('connection error', err);
        conn.end();
        reject(err);
      });

      conn.connect({
        host: serverUrl,
        port: 22,
        username: userName,
        privateKey: fs.readFileSync(pathToSSHPrivateKey),
      });
    });
  }
}
