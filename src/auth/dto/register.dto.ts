import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RegisterDto {

  @ApiProperty()
  @IsNotEmpty()
  username!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  password!: string;

  @ApiProperty()
  @IsOptional()
  role!: 'SUPER_ADMIN' | 'CUSTOMER';
}