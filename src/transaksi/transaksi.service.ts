import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  BookingStatus,
} from '@prisma/client';

import { PrismaService }
from 'src/prisma/prisma.service';

@Injectable()
export class TransaksiService {

  constructor(
    private prisma: PrismaService,
  ) {}

  // CREATE TRANSAKSI
  async create(data: any) {

    const bookingId =
      Number(data.bookingId);

    // UPDATE STATUS BOOKING
    await this.prisma.booking.update({

      where: {
        id: bookingId,
      },

      data: {
        status:
          BookingStatus.waiting_payment,
      },
    });

    return this.prisma.transaksi.create({

      data: {
        bookingId,
        total: Number(data.total),
        proof: data.proof,
      },
    });
  }

  // UPDATE STATUS
  async updateStatus(
    id: number,
    status: BookingStatus,
  ) {

    const transaksi =
      await this.prisma.transaksi.findUnique({

        where: {
          id: Number(id),
        },
      });

    if (!transaksi) {

      throw new NotFoundException(
        'Transaksi not found',
      );
    }

    return this.prisma.booking.update({

      where: {
        id: transaksi.bookingId,
      },

      data: {
        status,
      },
    });
  }

  // GET ALL
  findAll() {

    return this.prisma.transaksi.findMany({

      include: {

        booking: {

          include: {
            user: true,
            pet: true,
            package: true,
          },
        },
      },
    });
  }

  // GET DETAIL
  findOne(id: number) {

    return this.prisma.transaksi.findUnique({

      where: {
        id: Number(id),
      },

      include: {
        booking: true,
      },
    });
  }
}