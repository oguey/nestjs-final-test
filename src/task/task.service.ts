import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { Task } from '@prisma/client';
import { error } from 'console';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) {}  
   
    async addTask(name: string, userId: string, priority: number): Promise<void> {
        
        if (!this.isValidUserId(userId)) {
            throw new BadRequestException('Invalid userId');
        }
    
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        })
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
   
        try {
            console.log(`Creating task with name: ${name}, userId: ${userId}, priority: ${priority}`);
            await this.prisma.task.create({
                data: {
                    name,
                    priority: parseInt(String(priority), 10),
                    userId
                },
            });
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Invalid task data');
        }
    }

    getTaskByName(name: string): Promise<unknown> {
     return this.prisma.task.findFirst({
          where: {
              name:name
          },
      });
    }

   
    async getUserTasks(userId: string): Promise<unknown[]> {
        if (!this.isValidUserId(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
         
            throw new Error('User not found');
        }
        const tasks = await this.prisma.task.findMany({
            where: {
                userId,
            },
        });

        if (!tasks || tasks.length === 0) {
            throw new NotFoundException('No tasks found for the user');
        }
        return tasks;
    }


    private isValidUserId(userId: string): boolean {
        return userId.trim().length > 0 && /^[a-zA-Z0-9-_]+$/.test(userId);
    }


    async resetData(): Promise<void> {
        await this.prisma.task.deleteMany();
    }
}