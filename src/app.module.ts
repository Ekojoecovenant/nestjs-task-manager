import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', // The name of your database file
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'], // Scan for entity files
      synchronize: true, // Automatically sync schema (use ONLY for development)
    }),
    TaskModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
