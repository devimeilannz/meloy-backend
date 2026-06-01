import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService }
from 'src/prisma/prisma.service';

@Injectable()
export class GroomingPackageService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(data: any) {

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

  async findOne(
    id: number,
  ) {

    const groomingPackage =
      await this.prisma.groomingPackage.findUnique({
        where: {
          id,
        },
      });

    if (!groomingPackage) {
      throw new NotFoundException(
        'Paket tidak ditemukan',
      );
    }

    return groomingPackage;
  }

 async update(
  id: number,
  data: any,
) {

  await this.findOne(id);

  return this.prisma.groomingPackage.update({
    where: {
      id,
    },

    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
    },
  });
}

  async delete(
    id: number,
  ) {

    await this.findOne(id);

    return this.prisma.groomingPackage.delete({
      where: {
        id,
      },
    });
  }
}