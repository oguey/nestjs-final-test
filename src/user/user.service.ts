import { Injectable, NotImplementedException } from '@nestjs/common';
import {User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService) {}
 
    async user(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
      ): Promise<User | null> {
        return this.prisma.user.findUnique({
          where: userWhereUniqueInput,
        });
      }
    
   
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


    async addUser(email: string): Promise<void> {
      
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email address');
        }

   
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        
        await this.prisma.user.create({
            data: {
                email: email
            }        
        });
    }
    
   
    private isValidEmail(email: string): boolean {
       
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

   
    async isValidUserId(userId: string): Promise<boolean> {
    
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
     
      return !!user;
    }

    
    getUser(email: string): Promise<unknown> {
       return this.prisma.user.findUnique({
              where: {
                email: email
              }
         })
    }

  
    async resetData(): Promise<void> {
        await this.prisma.user.deleteMany()
    }
}