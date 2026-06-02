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

  async create(data: any, user: any) {
  const start = new Date(data.tanggal);
  start.setHours(0, 0, 0, 0);

  const end = new Date(data.tanggal);
  end.setHours(23, 59, 59, 999);

  // 1. CEK JAM SUDAH DIPAKAI ATAU BELUM
  const existing = await this.prisma.booking.findFirst({
    where: {
      tanggal: {
        gte: start,
        lte: end,
      },
      jam: data.jam,
    },
  });

  if (existing) {
    throw new BadRequestException(
      'Jam sudah dibooking, pilih jam lain',
    );
  }

  // 2. CEK TOTAL PER HARI (MAX 5)
  const total = await this.prisma.booking.count({
    where: {
      tanggal: {
        gte: start,
        lte: end,
      },
    },
  });

  if (total >= 5) {
    throw new BadRequestException(
      'Slot hari ini penuh',
    );
  }

  // 3. VALIDASI PACKAGE
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

  // 4. CREATE
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

  async findOne(id: number) {
  if (isNaN(id)) {
    throw new BadRequestException('ID booking tidak valid');
  }

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

  async availableSlot(tanggal: string) {
  const slots = [
    '09:00',
    '11:00',
    '13:00',
    '15:00',
    '17:00',
  ];

  const start = new Date(tanggal);
  start.setHours(0, 0, 0, 0);

  const end = new Date(tanggal);
  end.setHours(23, 59, 59, 999);

  const bookings = await this.prisma.booking.findMany({
    where: {
      tanggal: {
        gte: start,
        lte: end,
      },
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
async updateStatus(
  id: number,
  status: string,
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
      status: status as any,
    },

    include: {
      user: true,
      pet: true,
      package: true,
    },
  });
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
  async getCurrent(userId: number) {
  return this.prisma.booking.findMany({
    where: {
      userId,
      status: {
        in: [
          'pending',
          'paid',
          'proses_grooming',
        ],
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
