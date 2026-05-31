import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor }
from '@nestjs/platform-express';

import { JwtAuthGuard }
from 'src/helper/jwt-auth.guard';

import { TransaksiService }
from './transaksi.service';

import { UpdateStatusDto }
from './dto/update-status.dto';

import {Roles} from 'src/helper/roles.decorator';

import { RolesGuard }
from 'src/helper/roles-guard';

@Controller('transaksi')
export class TransaksiController {

  constructor(
    private transaksiService:
      TransaksiService,
  ) {}

  // GET ALL TRANSAKSI
  @UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Roles('SUPER_ADMIN')
@Get()
findAll() {
  return this.transaksiService.findAll();
}

  // GET DETAIL TRANSAKSI
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
  ) {
    return this.transaksiService.findOne(
      +id,
    );
  }

  // CREATE TRANSAKSI + UPLOAD BUKTI
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('proof', {
      dest: './uploads',
    }),
  )
  create(
    @Body() body: any,

    @UploadedFile()
    file: Express.Multer.File,
  ) {

    console.log(file);

    return this.transaksiService.create(
      body,
      file,
    );
  }

  // UPDATE STATUS TRANSAKSI
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
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