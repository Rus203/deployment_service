import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const currentUser = await this.findOne({ id }); // TODO: CHECK IT
    this.usersRepository.save({ ...currentUser, ...updateUserDto });
  }

  remove(id: string) {
    return this.usersRepository.delete({ id });
  }
}
