import { Module } from '@nestjs/common';
import { SshProvider } from './ssh.provider';

@Module({
  providers: [SshProvider],
  exports: [SshProvider],
})
export class SSHModule {}
