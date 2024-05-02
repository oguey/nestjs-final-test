import { Controller, Post, Get, Param, Body, Delete,BadRequestException,NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';

@Controller('task')
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
        private readonly userService: UserService,
    ) {}

    // Crée une nouvelle tâche
    @Post('/')
    async addTask(@Body() payload: { name: string; userId: string; priority: number }) {
        try {
            await this.taskService.addTask(payload.name, payload.userId, payload.priority);
            return { message: 'Task added successfully' };
        } catch (error) {
            if(error.message === 'Invalid userId format'){
                throw new BadRequestException('Invalid userId format')
            }else if(error.message ==='No tasks found for the user'){
                throw new BadRequestException('User not found')
            }else{
                throw new BadRequestException('Invalid task data')
            }            
        }
    }

    // Récupère une tâche par son nom
    @Get('/task/name/:name')
    async getTasksByName(@Param('name') name: string) {
        return this.taskService.getTaskByName(name);
    }

    // Récupère les tâches d'un utilisateur
    @Get('/user/:userId')
    async getUserTasks(@Param('userId') userId: string) {
        // Vérifiez si userId est valide
        if (!(await this.userService.isValidUserId(userId))) {
            throw new BadRequestException('Invalid userId');
        }

        const tasks = await this.taskService.getUserTasks(userId);
        if (!tasks || tasks.length === 0) {
            throw new NotFoundException ('No tasks found for the user');
        }
        return tasks;
    }

    // Réinitialise les données en supprimant toutes les tâches
    @Delete()
    async resetData() {
        await this.taskService.resetData();
        return { message: 'Task data reset successfully' };
    }
}