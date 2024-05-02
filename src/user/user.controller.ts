import { Controller,Get,Param,Body,Post,Delete ,NotFoundException, ConflictException,BadRequestException} from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    // Crée un nouvel utilisateur
    @Post('/user')
    async addUser(@Body('email') email: string) {
        try {
            await this.userService.addUser(email);
            return { message: 'User created successfully' };
        } catch (error) {
            if (error.message === 'Invalid email address') {
                // Si l'adresse e-mail est invalide, renvoie une erreur
                throw new BadRequestException('Invalid email address');
            } else if (error.message === 'User already exists') {
                // Si l'utilisateur existe déjà, renvoie une erreur
                throw new ConflictException('User already exists');
            } else {
                // Gère les autres erreurs
                throw new BadRequestException('Invalid data provided');
            }
        }
    }

    // Récupère un utilisateur par son adresse e-mail
    @Get(':email')
    async getUser(@Param('email') email: string) {
        const user = await this.userService.getUser(email);
        if (!user) {
            // Si l'utilisateur n'est pas trouvé, renvoie une erreur
            throw new NotFoundException('User not found');
        }
        return user;
    }  

    // Récupère tous les utilisateurs
    @Get('/')
    async getUsers() {
        return this.userService.users({});
    }

    // Réinitialise les données en supprimant tous les utilisateurs
    @Delete()
    async resetData(){
        await this.userService.resetData();
    }
}