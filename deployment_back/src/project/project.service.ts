import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../project/project.entity';
import { Repository } from 'typeorm';
import { GetProjectDto } from './dto/get-project.dto';
import { normalizeProjectName } from 'src/utils';
import { FileEncryptorProvider } from '../file-encryptor/file-encryptor.provider';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import FormData from 'form-data';
import { UpdateProjectDto } from './dto/update-project.dto';
import { HttpService } from '@nestjs/axios';
import { MiniBackService } from 'src/mini-back/mini-back.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private fileEncryptorProvider: FileEncryptorProvider,
    private readonly httpService: HttpService,
    private miniBackService: MiniBackService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    envFilePath: string,
    sshGitPrivateKeyProjectPath: string,
  ) {
    const candidate = await this.findAll({
      miniBackId: createProjectDto.miniBackId,
      name: createProjectDto.name,
    });

    if (candidate.length > 0) {
      throw new ConflictException('Try to make name of a project unique');
    }

    createProjectDto.name = normalizeProjectName(createProjectDto.name);

    await this.fileEncryptorProvider.encryptFilesOnPlace([
      sshGitPrivateKeyProjectPath,
      envFilePath,
    ]);

    sshGitPrivateKeyProjectPath = sshGitPrivateKeyProjectPath + '.enc';
    envFilePath = envFilePath + '.enc';

    const newProject = this.projectRepository.create({
      ...createProjectDto,
      envFilePath,
      sshGitPrivateKeyProjectPath,
    });

    return this.projectRepository.save(newProject);
  }

  async deployProject(id: string) {
    const project = await this.findOne(id);
    if (project === null) {
      throw new NotFoundException('Such project was not found');
    }

    let { sshGitPrivateKeyProjectPath, envFilePath } = project;

    await this.fileEncryptorProvider.decryptFilesOnPlace([
      sshGitPrivateKeyProjectPath,
      envFilePath,
    ]);

    sshGitPrivateKeyProjectPath = sshGitPrivateKeyProjectPath.replace(
      /.enc$/,
      '',
    );
    envFilePath = envFilePath.replace(/.enc$/, '');

    const data = new FormData();
    data.append('name', project.name);
    data.append('email', project.email);
    data.append('gitLink', project.gitProjectLink);
    data.append('port', project.port.toString());

    const sshGitPrivateKey = createReadStream(sshGitPrivateKeyProjectPath);
    data.append('sshGitPrivateKey', sshGitPrivateKey);

    const envFile = createReadStream(envFilePath);
    data.append('envFile', envFile);

    const miniBackPort = process.env.MINI_BACK_PORT;

    await this.fileEncryptorProvider.encryptFilesOnPlace(
      [sshGitPrivateKeyProjectPath, envFilePath].map((path) => {
        return path.replace(/.enc$/, '');
      }),
    );

    const url = `http://${
      project.miniBack.sshConnectionString.split('@')[1]
    }:${miniBackPort}/project`;

    const response = await this.postData(url, data);
    console.log('response', response);
    await this.update(project.id, { isDeploy: true });
    return response;
  }

  async runProjectOnServer() {
    //   const url = `http://46.101.110.15:3000/project/noname/run`;
    //   const response = await this.postData(url, {});
    //   console.log(response);
    //   return response;
  }

  async stopProjectOnServer() {
    const url = `http://46.101.110.15:3000/project/noname/stop`;

    // const response = await this.postData(url, {});
    // console.log(response);
    // return response;
  }

  async update(id: string, parameters: UpdateProjectDto) {
    const project = await this.findOne(id);
    if (project === null) {
      throw new NotFoundException('Such a project was not found');
    }

    this.projectRepository.update({ id }, parameters);
  }

  async findAll(getProjectDto: GetProjectDto) {
    return this.projectRepository.findBy(getProjectDto);
  }

  async findOne(id: string) {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['miniBack'],
    });
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    if (project === null) {
      throw new NotFoundException('Such a project was not found');
    }

    await fs.unlink(project.envFilePath);
    await fs.unlink(project.sshGitPrivateKeyProjectPath);

    return this.projectRepository.delete({ id });
  }

  async postData(url: string, data: FormData | object): Promise<any> {
    const response = await firstValueFrom(this.httpService.post(url, data));
    return response.data;
  }
}
