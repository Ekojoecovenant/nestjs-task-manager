/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Req,
  Patch,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CustomParseIntPipe } from './task.pipe';
import { Task } from './entities/task.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Handles GET requests to /users
  @Get()
  findAll(@Req() req: any): Promise<Task[]> {
    const userId: number = req?.user['id'] as number;
    return this.taskService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new CustomParseIntPipe('Please provide a valid integer for the ID.'),
    )
    id: number,
    @Req() req: any,
  ) {
    const userId: number = req?.user['id'] as number;
    return this.taskService.findOne(id, userId);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: any): Promise<Task> {
    const userId: number = req?.user['id'] as number;
    return this.taskService.create(createTaskDto, userId);
  }

  @Patch(':id')
  update(
    @Param(
      'id',
      new CustomParseIntPipe('Please provide a valid integer for the ID.'),
    )
    id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ): Promise<Task> {
    const userId: number = req?.user['id'] as number;
    return this.taskService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param(
      'id',
      new CustomParseIntPipe('Please provide a valid integer for the ID.'),
    )
    id: number,
    @Req() req: any,
  ) {
    const userId: number = req?.user['id'] as number;
    return this.taskService.remove(id, userId);
  }
}
