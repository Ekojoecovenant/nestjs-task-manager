import {
  Controller,
  Get,
  // Patch,
  Post,
  Delete,
  Body,
  Param,
  Put,
  HttpCode,
  HttpStatus,
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
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  // Handles GET requests to /task/:id
  // @Param('id') extracts the 'id' from the URL path.
  // ParseIntPipe ensures the ID is a number.
  @Get(':id')
  findOne(
    @Param(
      'id',
      new CustomParseIntPipe('Please provide a valid integer for the ID.'),
    )
    id: number,
  ) {
    return this.taskService.findOne(id);
  }

  // Handles POST requests to /task
  // @Body() extracts the entire JSON body from the request.
  // The input body MUST conform to the CreateTaskDto shape
  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  // Handles PUT requests to /task/:id
  // The input body MUST conform to the UpdateTaskDto shape
  @Put(':id')
  update(
    @Param(
      'id',
      new CustomParseIntPipe('Please provide a valid integer for the ID.'),
    )
    id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }
  // @Patch(':id')
  // update(
  //   @Param(
  //     'id',
  //     new CustomParseIntPipe('Please provide a valid integer for the ID.'),
  //   )
  //   id: number,
  //   @Body() updateTaskDto: UpdateTaskDto,
  // ) {
  //   return this.taskService.update(id, updateTaskDto);
  // }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param(
      'id',
      new CustomParseIntPipe('Please provide a valid integer for the ID.'),
    )
    id: number,
  ) {
    return this.taskService.remove(id);
  }
}
