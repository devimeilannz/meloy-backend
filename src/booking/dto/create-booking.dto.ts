import {
  IsDateString,
  IsInt,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  @IsInt()
  petId!: number;

  @ApiProperty()
  @IsInt()
  packageId!: number;

  @ApiProperty()
  @IsDateString()
  tanggal!: Date;

  @ApiProperty()
  @IsString()
  jam!: string;
}