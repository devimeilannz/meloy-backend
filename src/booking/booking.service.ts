import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService }
from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    data: any,
    user: any,
  ) {

    const count =
      await this.prisma.booking.count({
        where: {
          tanggal: new Date(data.tanggal),
          jam: data.jam,
        },
      });

    if (count >= 5) {
      throw new BadRequestException(
        'Slot penuh',
      );
    }

    const groomingPackage =
      await this.prisma.groomingPackage.findUnique({
        where: {
          id: Number(data.packageId),
        },
      });

    if (!groomingPackage) {
      throw new NotFoundException(
        'Paket grooming tidak ditemukan',
      );
    }

    return this.prisma.booking.create({
      data: {
        tanggal: new Date(data.tanggal),
        jam: data.jam,

        userId: Number(user.id),
        petId: Number(data.petId),

        packageId: Number(data.packageId),

        status: 'pending',
      },

      include: {
        pet: true,
        package: true,
      },
    });
  }

  findAll() {

    return this.prisma.booking.findMany({
      include: {
        user: true,
        pet: true,
        package: true,
        transaksi: true,
      },
    });
  }
}