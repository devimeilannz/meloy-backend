import { IsOptional } from 'class-validator';

export class VerifyPaymentDto {
  @IsOptional()
  note?: string;
}