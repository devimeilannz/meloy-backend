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

  async findOne(
  id: number,
) {

  if (isNaN(id)) {
    throw new BadRequestException(
      'ID booking tidak valid',
    );
  }

  const booking =
    await this.prisma.booking.findUnique({
      where: {
        id,
      },

      include: {
        user: true,
        pet: true,
        package: true,
        transaksi: true,
      },
    });

  if (!booking) {
    throw new NotFoundException(
      'Booking tidak ditemukan',
    );
  }

  return booking;
}

  async history(
    userId: number,
  ) {

    return this.prisma.booking.findMany({
      where: {
        userId,
      },

      include: {
        pet: true,
        package: true,
        transaksi: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async availableSlot(
  tanggal: string,
) {

  const jams = [
    '08:00',
    '10:00',
    '13:00',
    '15:00',
  ];

  const result: {
    jam: string;
    sisa: number;
  }[] = [];

  for (const jam of jams) {

    const total =
      await this.prisma.booking.count({
        where: {
          tanggal: new Date(tanggal),
          jam,
        },
      });

    result.push({
      jam,
      sisa: 5 - total,
    });
  }

  return result;
}

  async cancel(
    id: number,
  ) {

    const booking =
      await this.prisma.booking.findUnique({
        where: {
          id,
        },
      });

    if (!booking) {
      throw new NotFoundException(
        'Booking tidak ditemukan',
      );
    }

    return this.prisma.booking.update({
      where: {
        id,
      },

      data: {
        status: 'cancelled',
      },
    });
  }
}