import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransaksiDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  bookingId!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  total!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  proof?: string;
}