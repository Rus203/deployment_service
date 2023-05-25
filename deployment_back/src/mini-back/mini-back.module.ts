import { Module } from '@nestjs/common';
import { MiniBackService } from './mini-back.service';
import { SSHModule } from 'src/ssh/ssh.module';
import { FileEncryptorModule } from 'src/file-encryptor/files-encryptor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniBack } from './mini-back.entity';
import { MiniBackController } from './mini-back.controller';
import { StatusDeployModule } from 'src/status-deploy/status-deploy.module';

@Module({
  imports: [
    SSHModule,
    FileEncryptorModule,
    TypeOrmModule.forFeature([MiniBack]),
    StatusDeployModule,
  ],
  providers: [MiniBackService],
  exports: [MiniBackService],
  controllers: [MiniBackController],
})
export class MiniBackModule {}
