import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BookingService } from './booking.service';
import { JwtAuthGuard } from 'src/helper/jwt-auth.guard';
import { RolesGuard } from 'src/helper/roles-guard';
import { Roles } from 'src/helper/roles.decorator';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Booking') // 🔥 biar rapi di swagger
@ApiBearerAuth('access-token')
@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  // =====================
  // CREATE BOOKING
  // =====================
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() body: CreateBookingDto,
    @Req() req: any,
  ) {
    return this.bookingService.create(body, req.user);
  }

  // =====================
  // ADMIN - ALL BOOKING
  // =====================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  // =====================
  // AVAILABLE SLOT (pakai query)
  // contoh: /booking/available-slot?date=2026-06-10
  // =====================
  @Get('available-slot')
  getAvailableSlot(
    @Query('date') date: string,
  ) {
    return this.bookingService.availableSlot(date);
  }

  // =====================
  // HISTORY USER (LOGIN)
  // =====================
  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@Req() req: any) {
    return this.bookingService.history(req.user.id);
  }

  // =====================
  // CURRENT BOOKING
  // =====================
  @UseGuards(JwtAuthGuard)
  @Get('current')
  getCurrent(@Req() req: any) {
    return this.bookingService.getCurrent(req.user.id);
  }

  // =====================
  // DETAIL BOOKING
  // =====================
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const parsed = Number(id);

    if (isNaN(parsed)) {
      throw new BadRequestException(
        'ID booking tidak valid',
      );
    }

    return this.bookingService.findOne(parsed);
  }

  // =====================
  // CANCEL BOOKING
  // =====================
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    const parsed = Number(id);

    if (isNaN(parsed)) {
      throw new BadRequestException(
        'ID booking tidak valid',
      );
    }

    return this.bookingService.cancel(parsed);
  }

  // =====================
  // UPDATE STATUS
  // =====================
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateStatusDto,
  ) {
    const parsed = Number(id);

    if (isNaN(parsed)) {
      throw new BadRequestException(
        'ID booking tidak valid',
      );
    }

    return this.bookingService.updateStatus(
      parsed,
      body.status as any,
    );
  }
}