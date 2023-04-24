import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Project } from 'src/project/project.entity';

@Entity('mini-backs')
export class MiniBack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 255, name: 'ssh_server_private_key_path' })
  sshServerPrivateKeyPath: string;

  @Column({ name: 'server_url', length: 2047 })
  serverUrl: string;

  @Column({ name: 'name_remote_repository' })
  nameRemoteRepository: string;

  @ManyToOne(() => User, (user) => user.miniBacks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToMany(() => Project, (project) => project.miniBack)
  projects: Project[];
}
