import { Injectable } from '@nestjs/common';

import { PrismaService }
from 'src/prisma/prisma.service';

@Injectable()
export class PetsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(data: any) {

    return this.prisma.pet.create({
      data,
    });
  }

  findAll() {

    return this.prisma.pet.findMany({
      include: {
        user: true,
      },
    });
  }
}