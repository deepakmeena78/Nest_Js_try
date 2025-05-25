import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserTask {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  title: string;

  @IsNotEmpty()
  @IsString({ message: 'Invalid email format' })
  description: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'Password Minimum Lenght 4' })
  status: string;

  @IsNotEmpty()
  priority: string;

  @IsNotEmpty()
  userId: number;
}
