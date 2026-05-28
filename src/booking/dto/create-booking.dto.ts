import {
  IsDateString,
  IsInt,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  petId!: number;

  packageId!: number;

  tanggal!: Date;

  jam!: string;
}