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
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    // Injects the TypeORM Repository for the User entity
    // This allows us to use TypeORM methods like find(), save(), delete()
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<
    {
      id: number;
      name: string;
      email: string;
      role: Role;
    }[]
  > {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
  }

  async findOne(id: number): Promise<{
    id: number;
    name: string;
    email: string;
    password: string;
    role: Role;
  }> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const userObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    };

    return userObj;
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

  async update(
    id: number,
    updatedUserDto: UpdateUserDto,
  ): Promise<{
    id: number;
    name: string;
    email: string;
    role: Role;
  }> {
    if (updatedUserDto.email) {
      const existingUser = await this.findEmail(updatedUserDto.email);
      // this.logger.log(existingUser);

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email already in use');
      }
    }

    await this.findOne(id);
    await this.userRepository.update(id, updatedUserDto);

    const updatedUser = await this.findOne(id);
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };
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
