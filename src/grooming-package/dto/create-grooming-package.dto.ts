import {
  IsInt,
  IsString,
} from 'class-validator';

export class CreateGroomingPackageDto {

  @IsString()
    name!: string;

  @IsString()
    description!: string;

  @IsInt()
    price!: number;

  @IsString()
    image!: string;
}