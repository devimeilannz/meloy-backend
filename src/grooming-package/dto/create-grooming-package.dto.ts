import {
  IsInt,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroomingPackageDto {
@ApiProperty()
  @IsString()
    name!: string;
  @ApiProperty()
  @IsString()
    description!: string;

  @ApiProperty()
  @IsInt()
    price!: number;

}