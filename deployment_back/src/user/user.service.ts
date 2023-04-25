import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const instance = this.usersRepository.create(createUserDto);
    this.usersRepository.save(instance);
  }

  async findAll(getUserDto: GetUserDto) {
    return this.usersRepository.findBy(getUserDto);
  }

  async findOne(getUserDto: GetUserDto) {
    return this.usersRepository.findOneBy(getUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete({ id });
  }
}
