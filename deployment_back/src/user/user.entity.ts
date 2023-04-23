import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RefreshToken } from 'src/refresh-token/refresh-token.entity';
import { MiniBack } from 'src/mini-back/mini-back.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column()
  password: string;

  @Column({ length: 50, unique: true })
  email: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken[];

  @OneToMany(() => MiniBack, (miniBack) => miniBack.user)
  miniBacks: MiniBack[];
}
