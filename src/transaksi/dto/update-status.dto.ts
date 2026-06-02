import { IsEnum } from 'class-validator';

import { BookingStatus }
from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateStatusDto {
@ApiProperty({ enum: BookingStatus })
  @IsEnum(BookingStatus)
    status!: BookingStatus;
}