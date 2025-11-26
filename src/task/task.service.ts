import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(userId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { userId },
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId },
    });
    if (!found) {
      throw new NotFoundException(
        `Task with ID "${id}" not found for this user}`,
      );
    }
    return found;
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const newTask = this.taskRepository.create({ userId, ...createTaskDto });

    return this.taskRepository.save(newTask);
  }

  async update(
    id: number,
    updatedTaskDto: UpdateTaskDto,
    userId: number,
  ): Promise<Task> {
    // Check if task exists first
    await this.findOne(id, userId);

    // Updates the entity matching the ID with the partial data
    await this.taskRepository.update(id, updatedTaskDto);

    // Return the updated task object
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    // findOne() is called internallly by remove() to ensure the task exists before deletion
    await this.findOne(id, userId);

    await this.taskRepository.delete(id);
  }
}
