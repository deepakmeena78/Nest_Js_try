import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordRequestDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsStrongPassword()
  newPassword: string;
}
