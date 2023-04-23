import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('mini-backs')
export class MiniBack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
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
}
