import { ApiProperty } from '@nestjs/swagger';
import { BankName } from '@prisma/client';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty({ enum: BankName, example: BankName.SBI })
  @IsEnum(BankName)
  bank: BankName;

  @ApiProperty({ example: '123456789012' })
  @IsString()
  aadhar: string;

  @ApiProperty({ example: 'ABCDE1234F' })
  @IsString()
  panCard: string;

  @ApiProperty({ example: 1000.0, required: false })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  Acfreeze?: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  bankId: number;
}
