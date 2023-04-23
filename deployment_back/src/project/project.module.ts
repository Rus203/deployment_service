import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { FileEncryptorModule } from '../file-encryptor/files-encryptor.module';
import { SSHModule } from 'src/ssh/ssh.module';
import { MiniBackModule } from 'src/mini-back/mini-back.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [
    TypeOrmModule.forFeature([Project]),
    FileEncryptorModule,
    SSHModule,
    MiniBackModule,
  ],
})
export class ProjectModule {}
