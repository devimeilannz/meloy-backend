import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroomingPackageService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
  const existing = await this.prisma.groomingPackage.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existing) {
    throw new BadRequestException('Nama paket sudah digunakan');
  }

  return this.prisma.groomingPackage.create({
    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
    },
  });
}

  findAll() {
    return this.prisma.groomingPackage.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.groomingPackage.findUnique({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException('Paket tidak ditemukan');
    }

    return data;
  }

  async update(id: number, data: any) {
    await this.findOne(id);

    return this.prisma.groomingPackage.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price ? Number(data.price) : undefined,
      },
    });
  }

  async delete(id: number) {
    await this.findOne(id);

    return this.prisma.groomingPackage.delete({
      where: { id },
    });
  }
}