import { ApiProperty } from '@nestjs/swagger';
import { BankStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ApproveRequestDto {
  @ApiProperty()
  @IsNumber()
  requestId: number;

  @ApiProperty({ enum: BankStatus })
  @IsEnum(BankStatus)
  bankstatus: BankStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
