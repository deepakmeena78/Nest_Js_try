import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt({ message: 'User IDs must not be empty' })
  userId: number;

  @ApiProperty({ description: 'Type of business role', enum: UserStatus })
  @IsNotEmpty()
  @IsEnum(UserStatus, { message: 'Invalid status' })
  status: UserStatus;
}
