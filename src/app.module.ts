import { Module } from '@nestjs/common';

import { PrismaModule }
from './prisma/prisma.module';

import { AuthModule }
from './auth/auth.module';

import { PetsModule }
from './pets/pets.module';

import { BookingModule }
from './booking/booking.module';
 import { UsersModule }
from './users/users.module';
import { TransaksiModule }
from './transaksi/transaksi.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PetsModule,
    BookingModule,
    UsersModule,
    TransaksiModule,
  ],
})
export class AppModule {}