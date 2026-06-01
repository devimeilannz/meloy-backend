import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class RegisterDto {

  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsOptional()
  role!: 'SUPER_ADMIN' | 'CUSTOMER';
}