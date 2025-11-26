import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CustomParseIntPipe } from './user.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all users
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Get one user
  @Get(':id')
  findOne(
    @Param('id', new CustomParseIntPipe('Invalid ID')) id: number,
  ): Promise<User> {
    return this.userService.findOne(id);
  }

  // Add new user
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // Update user
  @Patch(':id')
  update(
    @Param('id', new CustomParseIntPipe('Please provide a valid ID'))
    id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  // Delete user
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', new CustomParseIntPipe('Please provide a valid ID'))
    id: number,
  ) {
    return this.userService.remove(id);
  }
}
