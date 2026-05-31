import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  BookingStatus,
} from '@prisma/client';

import { PrismaService }
from 'src/prisma/prisma.service';

import { CloudinaryService }
from 'src/cloudinary/cloudinary.service';

@Injectable()
export class TransaksiService {

  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // CREATE TRANSAKSI
  async create(
  data: any,
  file: Express.Multer.File,
) {

  const upload =
    await this.cloudinaryService
      .uploadFile(file.path);

  return this.prisma.transaksi.create({
    data: {
      bookingId:
        Number(data.bookingId),

      total:
        Number(data.total),

      proof:
        upload.secure_url,
    },
  });
}

  // UPDATE STATUS
  async updateStatus(
    id: number,
    status: string,
  ) {

    const transaksi =
      await this.prisma.transaksi.findUnique({

        where: {
          id,
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
        status: status as any,
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