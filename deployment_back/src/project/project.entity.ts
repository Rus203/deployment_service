import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { MiniBack } from 'src/mini-back/mini-back.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 255, name: 'ssh_git_private_key_project_path' })
  sshGitPrivateKeyProjectPath: string;

  @Column({ length: 2047, name: 'git_project_link' })
  gitProjectLink: string;

  @Column({ length: 255, name: 'env_file_path' })
  envFilePath: string;

  @ManyToOne(() => MiniBack, (miniBack) => miniBack.projects)
  @JoinColumn({ name: 'mini_back_id' })
  miniBack: MiniBack;

  @Column({ name: 'mini_back_id' })
  miniBackId: string;

  @Column({ default: false, type: 'boolean' })
  isDeploy: boolean;

  @Column()
  port: number;
}
