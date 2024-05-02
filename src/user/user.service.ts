import { Injectable, NotImplementedException } from '@nestjs/common';
import {User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService) {}
   
    // Récupère un utilisateur par son identifiant unique
    async user(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
      ): Promise<User | null> {
        return this.prisma.user.findUnique({
          where: userWhereUniqueInput,
        });
      }
    
    // Récupère plusieurs utilisateurs en fonction des paramètres fournis
    async users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
      }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
          skip,
          take,
          cursor,
          where,
          orderBy,
        });
      }

    // Ajoute un nouvel utilisateur à la base de données
    async addUser(email: string): Promise<void> {
        // Valide le format de l'adresse e-mail
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email address');
        }

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Ajoute l'utilisateur à la base de données
        await this.prisma.user.create({
            data: {
                email: email
            }        
        });
    }
    
    // Vérifie si une adresse e-mail est valide
    private isValidEmail(email: string): boolean {
        // Validation basique de l'e-mail avec une expression régulière
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Vérifie si un identifiant d'utilisateur est valide
    async isValidUserId(userId: string): Promise<boolean> {
      // Interroge la base de données pour obtenir un utilisateur par son ID
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
      // Si l'utilisateur existe, retourne true, sinon retourne false
      return !!user;
    }

    // Récupère un utilisateur par son adresse e-mail
    getUser(email: string): Promise<unknown> {
       return this.prisma.user.findUnique({
              where: {
                email: email
              }
         })
    }

    // Réinitialise les données en supprimant tous les utilisateurs
    async resetData(): Promise<void> {
        await this.prisma.user.deleteMany()
    }
}