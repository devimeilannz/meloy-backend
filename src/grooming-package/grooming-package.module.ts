import { Module } from '@nestjs/common';

import { GroomingPackageController }
from './grooming-package.controller';

import { GroomingPackageService }
from './grooming-package.service';

@Module({
  controllers: [
    GroomingPackageController,
  ],

  providers: [
    GroomingPackageService,
  ],
})
export class GroomingPackageModule {}