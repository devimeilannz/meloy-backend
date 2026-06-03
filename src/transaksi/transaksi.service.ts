import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

import PDFDocument from 'pdfkit';
import type { Response } from 'express';

@Injectable()
export class TransaksiService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // =========================
  // CREATE TRANSAKSI
  // =========================
  async create(data: any, file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new BadRequestException('File proof tidak ada');
    }

    const filePath = (file as any).path || (file as any).buffer;

    const upload = await this.cloudinaryService.uploadFile(filePath);

    if (!upload?.secure_url) {
      throw new BadRequestException('Upload gagal');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: Number(data.bookingId) },
    });

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    const existing = await this.prisma.transaksi.findUnique({
      where: { bookingId: Number(data.bookingId) },
    });

    if (existing) {
      throw new BadRequestException('Transaksi sudah ada');
    }

    return this.prisma.transaksi.create({
      data: {
        bookingId: Number(data.bookingId),
        total: Number(data.total),
        proof: upload.secure_url,
        paymentStatus: 'PENDING',
        groomingStatus: 'WAITING',
      },
      include: {
        booking: true,
      },
    });
  }

  // =========================
  // VERIFY PAYMENT → PAID
  // =========================
  async verifyPayment(id: number) {
    const trx = await this.prisma.transaksi.findUnique({
      where: { id },
    });

    if (!trx) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    if (!trx.proof) {
      throw new BadRequestException('Belum upload proof');
    }

    if (trx.paymentStatus === 'PAID') {
      throw new BadRequestException('Sudah diverifikasi');
    }

    return this.prisma.transaksi.update({
      where: { id },
      data: {
        paymentStatus: 'PAID',
      },
    });
  }

  // =========================
  // UPDATE GROOMING STATUS
  // =========================
  async updateGroomingStatus(id: number, status: string) {
    const trx = await this.prisma.transaksi.findUnique({
      where: { id },
    });

    if (!trx) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    if (trx.paymentStatus !== 'PAID') {
      throw new BadRequestException('Harus PAID dulu sebelum grooming');
    }

    const validFlow = ['WAITING', 'PROGRESS', 'DONE'];

    const currentIndex = validFlow.indexOf(trx.groomingStatus);
    const nextIndex = validFlow.indexOf(status);

    if (nextIndex === -1) {
      throw new BadRequestException('Status tidak valid');
    }

    if (nextIndex < currentIndex) {
      throw new BadRequestException('Tidak bisa mundur status');
    }

    return this.prisma.transaksi.update({
      where: { id },
      data: {
        groomingStatus: status,
      },
    });
  }

  // =========================
  // GET MY TRANSAKSI
  // =========================
  getMy(userId: number) {
    return this.prisma.transaksi.findMany({
      where: {
        booking: {
          userId: userId,
        },
      },
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
  // GET ONE
  // =========================
  findOne(id: number) {
    return this.prisma.transaksi.findUnique({
      where: { id },
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
  // REPORT
  // =========================
  getReport() {
    return this.findAll();
  }

  // =========================
  // PRINT PDF
  // =========================
  async printTransaksi(id: number, res: Response) {
    const trx = await this.prisma.transaksi.findUnique({
      where: { id },
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

    if (!trx) {
      throw new BadRequestException('Transaksi tidak ditemukan');
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=invoice-${id}.pdf`,
    );

    doc.pipe(res);

    doc.fontSize(20).text('INVOICE TRANSAKSI', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`ID: ${trx.id}`);
    doc.text(`Total: Rp ${trx.total}`);
    doc.text(`Payment: ${trx.paymentStatus}`);
    doc.text(`Grooming: ${trx.groomingStatus}`);
    doc.text(`Tanggal: ${trx.createdAt}`);

    doc.moveDown();
    doc.text('=== DETAIL BOOKING ===');

    doc.text(`Customer: ${trx.booking.user.username}`);
    doc.text(`Email: ${trx.booking.user.email}`);
    doc.text(`Pet: ${trx.booking.pet.name}`);
    doc.text(`Package: ${trx.booking.package.name}`);
    doc.text(`Tanggal: ${trx.booking.tanggal}`);

    doc.end();
  }
}