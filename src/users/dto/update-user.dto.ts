import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;
@ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;
}