import { Module } from '@nestjs/common';
import { MiniBackProvider } from './mini-back.provider';
import { SSHModule } from 'src/ssh/ssh.module';
import { FileEncryptorModule } from 'src/file-encryptor/files-encryptor.module';

@Module({
  imports: [SSHModule, FileEncryptorModule],
  providers: [MiniBackProvider],
  exports: [MiniBackProvider],
})
export class MiniBackModule {}
