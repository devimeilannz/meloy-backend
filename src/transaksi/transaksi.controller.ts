import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Res,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/helper/jwt-auth.guard';
import { RolesGuard } from 'src/helper/roles-guard';
import { Roles } from 'src/helper/roles.decorator';

import { TransaksiService } from './transaksi.service';

import type { Response } from 'express';

@ApiTags('Transaksi')
@ApiBearerAuth('access-token')
@Controller('transaksi')
export class TransaksiController {
  constructor(private transaksiService: TransaksiService) {}

  // =========================
  // CREATE TRANSAKSI
  // =========================
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('proof', { dest: './uploads' }))
  create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.transaksiService.create(body, file, req.user.id);
  }

  // =========================
  // GET ALL (ADMIN)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get()
  findAll() {
    return this.transaksiService.findAll();
  }

  // =========================
  // GET MY
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMy(@Req() req: any) {
    return this.transaksiService.getMy(req.user.id);
  }

  // =========================
  // VERIFY PAYMENT (PAID)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id/verify')
  verifyPayment(@Param('id') id: string) {
    return this.transaksiService.verifyPayment(Number(id));
  }

  // =========================
  // UPDATE GROOMING STATUS
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id/grooming')
  updateGrooming(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.transaksiService.updateGroomingStatus(
      Number(id),
      body.status,
    );
  }

  // =========================
  // PRINT PDF
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get(':id/print')
  print(@Param('id') id: string, @Res() res: Response) {
    return this.transaksiService.printTransaksi(Number(id), res);
  }

  // =========================
  // GET ONE
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transaksiService.findOne(Number(id));
  }

  // =========================
  // REPORT
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('report')
  getReport() {
    return this.transaksiService.getReport();
  }
}