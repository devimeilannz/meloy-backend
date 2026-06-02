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
} from '@nestjs/common';

import { BookingService } from './booking.service';
import { JwtAuthGuard } from 'src/helper/jwt-auth.guard';
import { RolesGuard } from 'src/helper/roles-guard';
import { Roles } from 'src/helper/roles.decorator';
@ApiBearerAuth('access-token')

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  // =====================
  // CREATE BOOKING
  // =====================
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Req() req: any) {
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
  // AVAILABLE SLOT
  // =====================
  @Get('available-slot/:tanggal')
  availableSlot(@Param('tanggal') tanggal: string) {
    return this.bookingService.availableSlot(tanggal);
  }

  // =====================
  // HISTORY USER
  // =====================
  @UseGuards(JwtAuthGuard)
  @Get('history/:userId')
  history(@Param('userId') userId: string) {
    const parsed = Number(userId);

    if (isNaN(parsed)) {
      throw new BadRequestException('User ID tidak valid');
    }

    return this.bookingService.history(parsed);
  }
  // =====================
// CURRENT BOOKING (USER LOGIN)
// =====================
@UseGuards(JwtAuthGuard)
@Get('current')
getCurrent(@Req() req: any) {
   console.log(req.user);
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
      throw new BadRequestException('ID booking tidak valid');
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
      throw new BadRequestException('ID booking tidak valid');
    }

    return this.bookingService.cancel(parsed);
  }

  // =====================
  // UPDATE STATUS
  // =====================
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: any) {
    const parsed = Number(id);

    if (isNaN(parsed)) {
      throw new BadRequestException('ID booking tidak valid');
    }

    return this.bookingService.updateStatus(parsed, body.status);
  }
 
}

function ApiBearerAuth(_name: string): (target: typeof BookingController) => void | typeof BookingController {
  // Minimal no-op implementation to satisfy decorator usage in this file.
  // In real projects this would come from @nestjs/swagger.
  return (target: typeof BookingController) => target;
}
