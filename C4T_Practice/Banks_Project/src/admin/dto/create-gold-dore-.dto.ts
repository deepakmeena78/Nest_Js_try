import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsJSON,
  IsInt,
  IsObject,
} from 'class-validator';

export class CreateDoreBarDetailDto {
  @ApiProperty({ example: 12.5 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  weightKg: number;

  @ApiProperty({ example: 99.95 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  purityPercent: number;

  @ApiProperty({ example: 12456.78 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  goldContentG: number;

  @ApiPropertyOptional({ example: 500.45 })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  silverContentG?: number;

  @ApiPropertyOptional({
    description: 'Other metals composition in JSON format',
    example: { Copper: 200.25, Zinc: 50.75 },
  })
  @IsOptional()
  @IsObject()
  otherMetals?: Record<string, number>;

  @ApiPropertyOptional({ example: 1001 })
  @IsOptional()
  @IsNumber()
  @IsInt()
  goldDoreFormId?: number;
}
