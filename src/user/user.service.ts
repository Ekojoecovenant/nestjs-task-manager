import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    // Injects the TypeORM Repository for the User entity
    // This allows us to use TypeORM methods like find(), save(), delete()
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = this.userRepository.findOneBy({ id });
    if (!(await user)) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user as unknown as User;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findEmail(createUserDto.email);
    // this.logger.log(existingUser);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this.userRepository.create(createUserDto);

    return this.userRepository.save(newUser);
  }

  async update(id: number, updatedUserDto: UpdateUserDto): Promise<User> {
    if (updatedUserDto.email) {
      const existingUser = await this.findEmail(updatedUserDto.email);
      // this.logger.log(existingUser);

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email already in use');
      }
    }

    await this.findOne(id);
    await this.userRepository.update(id, updatedUserDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    const deletedUser = await this.findOne(id);
    await this.userRepository.delete(id);
    return deletedUser;
  }

  async findEmail(email: string): Promise<User> {
    const query = 'SELECT * FROM user WHERE email = ?';
    const user: Promise<User[]> = this.userRepository.query(query, [email]);
    return (await user)[0];
  }
}
