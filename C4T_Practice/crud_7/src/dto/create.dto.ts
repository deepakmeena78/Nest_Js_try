import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'Minimum Lenght 4' })
  password: string;
}
