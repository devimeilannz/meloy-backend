import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor }
from '@nestjs/platform-express';

import { CloudinaryService }
from 'src/cloudinary/cloudinary.service';

import { TransaksiService }
from './transaksi.service';

import { UpdateStatusDto }
from './dto/update-status.dto';

@Controller('transaksi')

export class TransaksiController {

  constructor(

    private transaksiService:
      TransaksiService,

    private cloudinaryService:
      CloudinaryService,
  ) {}

  // GET ALL
  @Get()

  findAll() {

    return this.transaksiService.findAll();
  }

  // GET DETAIL
  @Get(':id')

  findOne(
    @Param('id') id: string,
  ) {

    return this.transaksiService.findOne(
      +id,
    );
  }

  // CREATE TRANSAKSI
  @Post()

  create(
    @Body() body: any,
  ) {

    return this.transaksiService.create(
      body,
    );
  }

  // UPLOAD BUKTI
  @Post('upload/:bookingId')

  @UseInterceptors(
    FileInterceptor('file'),
  )

  async uploadProof(

    @Param('bookingId')
    bookingId: string,

    @UploadedFile()
    file: Express.Multer.File,
  ) {

    const result =
      await this.cloudinaryService.uploadFile(
        file.path,
      );

    return this.transaksiService.create({

      bookingId:
        Number(bookingId),

      total: 50000,

      proof:
        result.secure_url,
    });
  }

  // UPDATE STATUS
  @Patch(':id/status')

  updateStatus(

    @Param('id')
    id: string,

    @Body()
    body: UpdateStatusDto,
  ) {

    return this.transaksiService.updateStatus(

      +id,

      body.status,
    );
  }
}