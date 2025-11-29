import {
  Body,
  Controller,
  Delete,
  Get,
  // HttpCode,
  // HttpStatus,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { User } from './entities/user.entity';
import { CustomParseIntPipe } from './user.pipe';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all users
  @Roles(Role.Admin)
  @Get()
  async findAll(): Promise<
    {
      id: number;
      name: string;
      email: string;
      role: Role;
    }[]
  > {
    return this.userService.findAll();
  }

  // Get one user
  @Roles(Role.Admin)
  @Get(':id')
  async findOne(
    @Param('id', new CustomParseIntPipe('Invalid ID')) id: number,
  ): Promise<{
    id: number;
    name: string;
    email: string;
    password: string;
    role: Role;
  }> {
    const user = await this.userService.findOne(id);
    return user;
  }

  // Add new user
  // @Roles(Role.Admin)
  // @Post()
  // create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.userService.create(createUserDto);
  // }

  // Update user
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id', new CustomParseIntPipe('Please provide a valid ID'))
    id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{
    id: number;
    name: string;
    email: string;
    role: Role;
  }> {
    return await this.userService.update(id, updateUserDto);
  }

  // Delete user
  @Roles(Role.Admin)
  @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new CustomParseIntPipe('Please provide a valid ID'))
    id: number,
  ): Promise<{
    message: string;
    user: {
      id: number;
      email: string;
    };
  }> {
    const user = await this.userService.remove(id);
    return {
      message: 'User deleted successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
