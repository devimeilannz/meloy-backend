import { Injectable } from '@nestjs/common';

import { PrismaService }
from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService,
  ) {}

  // GET ALL CUSTOMER
  findAll() {

    return this.prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
      },

      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // GET CUSTOMER DETAIL
  findOne(
    id: number,
  ) {

    return this.prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        pets: true,
        bookings: true,
      },
    });
  }

  // GET PROFILE
  profile(
    id: number,
  ) {

    return this.prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // UPDATE PROFILE
  updateProfile(
    id: number,
    data: any,
  ) {

    return this.prisma.user.update({
      where: {
        id,
      },

      data: {
        username: data.username,
        email: data.email,
      },
    });
  }

  // DELETE ACCOUNT
  deleteProfile(
    id: number,
  ) {

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}