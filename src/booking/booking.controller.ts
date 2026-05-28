import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BookingService }
from './booking.service';

import { JwtAuthGuard }
from 'src/helper/jwt-auth.guard';

@Controller('booking')
export class BookingController {

  constructor(
    private bookingService:
      BookingService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() body: any,
    @Req() req: any,
  ) {

    return this.bookingService.create(
      body,
      req.user,
    );
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }
}