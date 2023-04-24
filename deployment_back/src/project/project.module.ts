import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { FileEncryptorModule } from '../file-encryptor/files-encryptor.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [
    TypeOrmModule.forFeature([Project]),
    FileEncryptorModule,
    HttpModule,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
