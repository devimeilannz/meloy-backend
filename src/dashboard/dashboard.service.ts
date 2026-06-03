import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async summary() {

    const totalUser =
      await this.prisma.user.count();

    const totalPet =
      await this.prisma.pet.count();

    const totalBooking =
      await this.prisma.booking.count();

    const totalTransaksi =
      await this.prisma.transaksi.count();

    const pendingBooking =
      await this.prisma.booking.count({
        where: {
          status: BookingStatus.pending,
        },
      });

    const completedBooking =
      await this.prisma.booking.count({
        where: {
          status: BookingStatus.confirmed,
        },
      });

    return {
      totalUser,
      totalPet,
      totalBooking,
      totalTransaksi,
      pendingBooking,
      completedBooking,
    };
  }
}