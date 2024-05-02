import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { Task } from '@prisma/client';
import { error } from 'console';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) {}  
    
    // Ajoute une nouvelle tâche
    async addTask(name: string, userId: string, priority: number): Promise<void> {
        // Vérifie si l'userId est valide
        if (!this.isValidUserId(userId)) {
            throw new BadRequestException('Invalid userId');
        }
    
        // Vérifie si l'utilisateur avec l'userId fourni existe
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        })
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        // Si l'utilisateur existe, crée la tâche
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

    // Récupère une tâche par son nom
    getTaskByName(name: string): Promise<unknown> {
     return this.prisma.task.findFirst({
          where: {
              name:name
          },
      });
    }

    // Récupère les tâches d'un utilisateur
    async getUserTasks(userId: string): Promise<unknown[]> {
        if (!this.isValidUserId(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            // Si l'utilisateur n'est pas trouvé, lance une erreur
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

    // Vérifie si un userId est valide
    private isValidUserId(userId: string): boolean {
        return userId.trim().length > 0 && /^[a-zA-Z0-9-_]+$/.test(userId);
    }

    // Réinitialise les données
    async resetData(): Promise<void> {
        await this.prisma.task.deleteMany();
    }
}