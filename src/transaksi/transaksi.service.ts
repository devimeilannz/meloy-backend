import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class TransaksiService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // =========================
  // CREATE TRANSAKSI
  // =========================
  async create(data: any, file: Express.Multer.File, user: any) {
    if (!file) {
      throw new BadRequestException('File proof tidak ditemukan');
    }

    if (!file.path) {
      throw new BadRequestException(
        'File tidak punya path. Cek multer config (diskStorage vs memoryStorage)',
      );
    }

    const upload = await this.cloudinaryService.uploadFile(file.path);

    if (!upload?.secure_url) {
      throw new BadRequestException('Upload ke Cloudinary gagal');
    }

    return this.prisma.transaksi.create({
      data: {
        bookingId: Number(data.bookingId),
        total: Number(data.total),
        proof: upload.secure_url,
      },
    });
  }

  // =========================
  // UPDATE STATUS
  // =========================
  async updateStatus(id: number, status: string) {
    const transaksi = await this.prisma.transaksi.findUnique({
      where: { id },
    });

    if (!transaksi) {
      throw new NotFoundException('Transaksi not found');
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

  // =========================
  // GET ALL
  // =========================
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

  // =========================
  // GET DETAIL
  // =========================
  findOne(id: number) {
    return this.prisma.transaksi.findUnique({
      where: { id },
      include: {
        booking: true,
      },
    });
  }

  async getReport() {
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

  // =========================
  // GET MY TRANSAKSI
  // =========================
  async getMy(userId: number) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      select: { id: true },
    });

    const bookingIds = bookings.map((b) => b.id);

    if (bookingIds.length === 0) {
      return [];
    }

    return this.prisma.transaksi.findMany({
      where: {
        bookingId: {
          in: bookingIds,
        },
      },
      include: {
        booking: true,
      },
    });
  }
}