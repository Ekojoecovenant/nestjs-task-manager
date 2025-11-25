import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

// const Task = [
//   {
//     id: 1,
//     title: 'Learn HTML',
//   },
//   {
//     id: 2,
//     title: 'Learn CSS',
//     description: 'Learning about Cascading Style Sheet',
//   },
// ];

@Injectable()
export class TaskService {
  constructor(
    // Injects the TypeORM Repository for the Task entity
    // This allows us to use TypeORM methods like find(), save(), delete()
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // Finds and returns all tasks
  findAll() {
    return this.taskRepository.find();
  }

  // Finds one task by ID, or throws and error if not found
  findOne(id: number) {
    const task = this.taskRepository.findOneBy({ id });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!task) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return task as unknown as Task;
  }

  // Creates and saves a new task to the database
  // Accepts the validated CreateTaskDto
  create(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.create(createTaskDto);

    return this.taskRepository.save(newTask);
  }

  // Updates an existing task by ID
  // Accepts the validated UpdateTaskDto
  async update(id: number, updatedTaskDto: UpdateTaskDto): Promise<Task> {
    // Check if task exists first
    this.findOne(id);

    // Updates the entity matching the ID with the partial data
    await this.taskRepository.update(id, updatedTaskDto);

    // Return the updated task object
    return this.findOne(id);

    // const foundTaskIndex = Task.findIndex((task) => task.id === id);

    // if (foundTaskIndex === -1) {
    //   throw new NotFoundException('Task not found');
    // }

    // const props = ['id', 'title', 'description'];

    // for (const [prop, value] of Object.entries(updatedTaskDto)) {
    //   if (props.includes(prop)) {
    //     Task[foundTaskIndex][prop] = value as string;
    //   }
    // }

    // return Task[foundTaskIndex];
  }

  async remove(id: number) {
    // findOne() is called internallly by remove() to ensure the task exists before deletion
    this.findOne(id);

    await this.taskRepository.delete(id);

    // const foundTaskIndex = Task.findIndex((task) => task.id === id);

    // if (foundTaskIndex === -1) {
    //   throw new NotFoundException('Task not found');
    // }

    // const deletedTask = Task[foundTaskIndex];
    // Task.splice(foundTaskIndex, 1);

    // return deletedTask;
  }
}
