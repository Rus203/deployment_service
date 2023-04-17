import { RefreshToken } from 'src/refresh-token/refresh-token.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 255, name: 'ssh_git_public_key_project_path' })
  sshGitPublicKeyProjectPath: string;

  @Column({ length: 255, name: 'ssh_git_private_key_project_path' })
  sshGitPrivateKeyProjectPath: string;

  @Column({ length: 2047, name: 'git_project_link' })
  gitProjectLink: string;

  @Column({ length: 255, name: 'env_file_path' })
  envFilePath: string;

  @Column({ length: 255, name: 'ssh_server_private_key_path' })
  sshServerPrivateKeyPath: string;

  @Column({ length: 2047, name: 'server_url' })
  serverUrl: string;

  @ManyToOne(() => User, (user) => user.project, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;
}
