import { Module } from '@nestjs/common';

import { PrismaModule }
from './prisma/prisma.module';

import { AuthModule }
from './auth/auth.module';

import { PetsModule }
from './pets/pets.module';

import { GroomingPackageModule }
from './grooming-package/grooming-package.module';

import { BookingModule }
from './booking/booking.module';
 import { UsersModule }
from './users/users.module';
import { TransaksiModule }
from './transaksi/transaksi.module';
import {DashboardModule} from "./dashboard/dashboard.module";
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PetsModule,
    GroomingPackageModule,
    BookingModule,
    UsersModule,
    TransaksiModule,
    DashboardModule,
  ],
})
export class AppModule {}