import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BankName } from '@prisma/client';

export class CreateBankDto {
  @ApiProperty({ enum: BankName, description: 'Select the bank from the list' })
  @IsEnum(BankName)
  bank_name: BankName;

  @IsString()
  @ApiProperty()
  @IsOptional()
  location: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  document: string;

  @IsString()
  @ApiProperty()
  owner_name: string;

  @IsNumber()
  @ApiProperty()
  ownerId: number;
}
