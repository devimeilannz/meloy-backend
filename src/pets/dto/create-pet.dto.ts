import {
  IsInt,
  IsString,
} from 'class-validator';

export class CreatePetDto {

  @IsString()
    name!: string;

  @IsString()
    type!: string;

  @IsInt()
    age!: number;

  @IsInt()
    userId!: number;
}