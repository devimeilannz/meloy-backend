import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransaksiDto {
@ApiProperty()
  @IsInt()
    bookingId!: number;
@ApiProperty()
  @IsInt()
    total!: number;
@ApiProperty()
  @IsOptional()
  @IsString()
  proof?: string;
}