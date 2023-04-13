import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/';
import { Repository } from 'typeorm';
import { GetUserDto } from './dto/get-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const instance = this.usersRepository.create(createUserDto);
    this.usersRepository.save(instance);
  }

  async findAll(getUserDto: GetUserDto) {
    return this.usersRepository.findBy(getUserDto);
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user === null) {
      throw new NotFoundException('Not found such a user');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const currentUser = await this.findOne(id); // TODO: CHECK IT
    this.usersRepository.save({ ...currentUser, id });
  }

  remove(id: string) {
    return this.usersRepository.delete({ id });
  }
}
