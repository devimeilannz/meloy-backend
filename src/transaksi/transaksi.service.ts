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
  async create(data: any, file: Express.Multer.File, user: any) {
    if (!file) {
      throw new BadRequestException('File proof tidak ada');
    }

    const filePath = (file as any).path || (file as any).buffer;

    const upload = await this.cloudinaryService.uploadFile(filePath);

    if (!upload?.secure_url) {
      throw new BadRequestException('Upload gagal');
    }

    const existing = await this.prisma.transaksi.findUnique({
      where: {
        bookingId: Number(data.bookingId),
      },
    });

    if (existing) {
      throw new BadRequestException('Transaksi sudah ada');
    }

    return this.prisma.transaksi.create({
      data: {
        bookingId: Number(data.bookingId),
        total: Number(data.total),
        proof: upload.secure_url,
      },
      include: {
        booking: true,
      },
    });
  }

  // =========================
  // GET MY TRANSAKSI (FIX ERROR KAMU)
  // =========================
  async getMy(userId: number) {
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
  // UPDATE STATUS
  // =========================
  async updateStatus(id: number, status: string) {
    const transaksi = await this.prisma.transaksi.findUnique({
      where: { id },
    });

    if (!transaksi) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    return this.prisma.transaksi.update({
      where: { id },
      data: { status: status as any },
    });
  }

  // =========================
  // FIND ALL
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
  // FIND ONE
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
  // PRINT PDF (FIX PDFKIT ERROR)
  // =========================
  async printTransaksi(id: number, res: Response) {
    const transaksi = await this.prisma.transaksi.findUnique({
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

    if (!transaksi) {
      throw new BadRequestException('Transaksi tidak ditemukan');
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=invoice-${id}.pdf`,
    );
    res.setHeader('Cache-Control', 'no-cache');

    doc.pipe(res);

    // ======================
    // PDF CONTENT
    // ======================
    doc.fontSize(20).text('INVOICE TRANSAKSI', {
      align: 'center',
    });

    doc.moveDown();

    doc.fontSize(12).text(`ID: ${transaksi.id}`);
    doc.text(`Total: Rp ${transaksi.total}`);
    doc.text(`Status: ${transaksi.status}`);
    doc.text(`Tanggal: ${transaksi.createdAt}`);

    doc.moveDown();
    doc.text('=== DETAIL BOOKING ===');

    doc.text(`Customer: ${transaksi.booking.user.username}`);
    doc.text(`Email: ${transaksi.booking.user.email}`);
    doc.text(`Pet: ${transaksi.booking.pet.name}`);
    doc.text(`Package: ${transaksi.booking.package.name}`);
    doc.text(`Tanggal Booking: ${transaksi.booking.tanggal}`);

    doc.end();
  }
}