import { Module } from '@nestjs/common';

import { GroomingPackageController }
from './grooming-package.controller';

import { GroomingPackageService }
from './grooming-package.service';

import { PrismaModule }
from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    GroomingPackageController,
  ],

  providers: [
    GroomingPackageService,
  ],
})
export class GroomingPackageModule {}