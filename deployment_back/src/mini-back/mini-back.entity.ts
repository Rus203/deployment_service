import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ProjectState } from '../enums';

@Entity('mini-backs')
export class MiniBack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 255, name: 'ssh_server_private_key_path' })
  sshServerPrivateKeyPath: string;

  @Column({ name: 'ssh_connection_string', length: 2047 })
  sshConnectionString: string;

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

  @Column({
    default: ProjectState.UNDEPLOYED,
    type: 'enum',
    enum: ProjectState,
  })
  deployState: ProjectState;

  @Column()
  port: number;

  @Column({ name: 'user_name' })
  userName: string;
}
