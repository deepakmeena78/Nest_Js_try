import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInUser {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'Password Minimum Lenght 4' })
  password: string;
}
