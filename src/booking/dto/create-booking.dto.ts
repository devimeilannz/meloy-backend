import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString, IsIn } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsInt()
  petId!: number;

  @ApiProperty()
  @IsInt()
  packageId!: number;

  @ApiProperty()
  @IsDateString()
  tanggal!: string;

  @ApiProperty()
  @IsIn(['09:00', '11:00', '13:00', '15:00', '17:00'])
  jam!: string;
}