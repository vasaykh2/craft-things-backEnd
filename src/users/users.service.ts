import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { User } from './entities/user.entity';
import { Card } from '../cards/entities/card.entity';
import { USER_ALREADY_EXIST } from '../utils/constants/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Card)
    private readonly cardsRepository: Repository<Card>,
    private readonly hashService: HashService,
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save({
      ...CreateUserDto,
      password: await this.hashService.hash(CreateUserDto.password),
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();

    return users;
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateById(id: number, UpdateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (UpdateUserDto.username && UpdateUserDto.username !== user.username) {
      const usernameMatches = await this.findByUsername(UpdateUserDto.username);
      if (usernameMatches) {
        throw new BadRequestException(USER_ALREADY_EXIST);
      }
    }

    if (UpdateUserDto.email && UpdateUserDto.email !== user.email) {
      const emailMatches = await this.findByEmail(UpdateUserDto.email);
      if (emailMatches) {
        throw new BadRequestException(USER_ALREADY_EXIST);
      }
    }

    if (UpdateUserDto.password) {
      UpdateUserDto.password = await this.hashService.hash(
        UpdateUserDto.password,
      );
    }

    const newUserData: User = {
      ...user,
      password: UpdateUserDto?.password,
      email: UpdateUserDto?.email,
      about: UpdateUserDto?.about,
      username: UpdateUserDto?.username,
      avatar: UpdateUserDto?.avatar,
    };
    await this.usersRepository.update(user.id, newUserData);

    return await this.findById(id);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
