import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // CREATE BOOKING
  // =========================
  async create(data: CreateBookingDto, user: any) {
    const start = new Date(data.tanggal);
    start.setHours(0, 0, 0, 0);

    const end = new Date(data.tanggal);
    end.setHours(23, 59, 59, 999);

    const existing = await this.prisma.booking.findFirst({
      where: {
        tanggal: { gte: start, lte: end },
        jam: data.jam,
      },
    });

    if (existing) {
      throw new BadRequestException('Jam sudah dibooking');
    }

    const total = await this.prisma.booking.count({
      where: {
        tanggal: { gte: start, lte: end },
      },
    });

    if (total >= 5) {
      throw new BadRequestException('Slot hari ini penuh');
    }

    const pet = await this.prisma.pet.findUnique({
      where: { id: Number(data.petId) },
    });

    if (!pet) {
      throw new NotFoundException('Pet tidak ditemukan');
    }

    const pkg = await this.prisma.groomingPackage.findUnique({
      where: { id: Number(data.packageId) },
    });

    if (!pkg) {
      throw new NotFoundException('Paket tidak ditemukan');
    }

    return this.prisma.booking.create({
      data: {
        tanggal: new Date(data.tanggal),
        jam: data.jam,
        userId: Number(user.id),
        petId: Number(data.petId),
        packageId: Number(data.packageId),
        status: BookingStatus.pending,
      },
      include: {
        pet: true,
        package: true,
        user: true,
      },
    });
  }

  // =========================
  // GET ALL (ADMIN)
  // =========================
  findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: true,
        pet: true,
        package: true,
        transaksi: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =========================
  // GET ONE
  // =========================
  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        pet: true,
        package: true,
        transaksi: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    return booking;
  }

  // =========================
  // HISTORY USER
  // =========================
  history(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
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

  // =========================
  // AVAILABLE SLOT
  // =========================
  async availableSlot(tanggal: string) {
    const slots = ['09:00', '11:00', '13:00', '15:00', '17:00'];

    const start = new Date(tanggal);
    start.setHours(0, 0, 0, 0);

    const end = new Date(tanggal);
    end.setHours(23, 59, 59, 999);

    const bookings = await this.prisma.booking.findMany({
      where: {
        tanggal: { gte: start, lte: end },
      },
      select: {
        jam: true,
      },
    });

    const bookedSlots = bookings.map((b) => b.jam);

    const availableSlots = slots.filter(
      (jam) => !bookedSlots.includes(jam),
    );

    return {
      tanggal,
      slots,
      bookedSlots,
      availableSlots,
      isFull: availableSlots.length === 0,
    };
  }

  // =========================
  // UPDATE STATUS (SAFE FLOW)
  // =========================
  async updateStatus(id: number, status: BookingStatus) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    const validTransitions: Record<string, BookingStatus[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['cancelled'],
      cancelled: [],
    };

    if (!validTransitions[booking.status].includes(status)) {
      throw new BadRequestException(
        `Tidak bisa ubah dari ${booking.status} ke ${status}`,
      );
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  // =========================
  // CANCEL BOOKING
  // =========================
  async cancel(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.cancelled,
      },
    });
  }

  // =========================
  // CURRENT BOOKING
  // =========================
  getCurrent(userId: number) {
    return this.prisma.booking.findMany({
      where: {
        userId,
        status: {
          in: [BookingStatus.pending, BookingStatus.confirmed],
        },
      },
      include: {
        pet: true,
        package: true,
        transaksi: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}