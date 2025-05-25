import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangeUserPasswordRequestDto {
  @ApiProperty()
  @IsStrongPassword()
  newPassword: string;

  @ApiProperty()
  @IsString()
  newConfirmPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
