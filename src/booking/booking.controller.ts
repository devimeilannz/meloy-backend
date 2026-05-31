import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BookingService }
from './booking.service';

import { JwtAuthGuard }
from 'src/helper/jwt-auth.guard';

import { RolesGuard }
from 'src/helper/roles-guard';

import { Roles }
from 'src/helper/roles.decorator';

@Controller('booking')
export class BookingController {

  constructor(
    private bookingService:
      BookingService,
  ) {}

  // CREATE BOOKING
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

  // ADMIN - SEMUA BOOKING
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('SUPER_ADMIN')
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  // HISTORY CUSTOMER
  @UseGuards(JwtAuthGuard)
  @Get('history/:userId')
  history(
    @Param('userId')
    userId: string,
  ) {
    return this.bookingService.history(
      Number(userId),
    );
  }

  // AVAILABLE SLOT
  @Get('available-slot/:tanggal')
  availableSlot(
    @Param('tanggal')
    tanggal: string,
  ) {
    return this.bookingService.availableSlot(
      tanggal,
    );
  }

  // CANCEL BOOKING
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(
    @Param('id')
    id: string,
  ) {
    return this.bookingService.cancel(
      Number(id),
    );
  }

  // DETAIL BOOKING
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.bookingService.findOne(
      Number(id),
    );
  }
}