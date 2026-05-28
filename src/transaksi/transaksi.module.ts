import { Module }
from '@nestjs/common';

import { CloudinaryModule }
from 'src/cloudinary/cloudinary.module';

import { TransaksiController }
from './transaksi.controller';

import { TransaksiService }
from './transaksi.service';

@Module({

  imports: [
    CloudinaryModule,
  ],

  controllers: [
    TransaksiController,
  ],

  providers: [
    TransaksiService,
  ],
})

export class TransaksiModule {}