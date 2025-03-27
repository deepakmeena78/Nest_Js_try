import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './Schema/user.schema'; // Ensure this is the correct path
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private useRepository: Repository<User>,
    ) { }


    async signupUser(userData: Partial<User>): Promise<User> {          // Create User 
        const newUser = this.useRepository.create(userData);
        return this.useRepository.save(newUser);
    }


    async getAllUsers(): Promise<User[]> {                               // Get User
        return await this.useRepository.find();
    }


    async updateUser(userData: Partial<User>): Promise<User | null> {     //   Update User
        if (!userData.id) {
            throw new Error('User ID is required for updating');
        }
        await this.useRepository.update(userData.id, userData);
        return this.useRepository.findOne({ where: { id: userData.id } });
    }



    async deleteUser(userData: Partial<User>): Promise<User | null> {     // Delete User
        if (!userData.id) {
            throw new Error('User ID is required');
        }
        const user = await this.useRepository.findOne({
            where: { id: userData.id },
        });
        if (!user) {
            return null;
        }
        await this.useRepository.delete(userData.id);
        return user;
    }
}
