import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransaksiDto {

  @IsInt()
    bookingId!: number;

  @IsInt()
    total!: number;

  @IsOptional()
  @IsString()
  proof?: string;
}