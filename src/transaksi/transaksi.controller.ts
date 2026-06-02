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
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/helper/jwt-auth.guard';
import { RolesGuard } from 'src/helper/roles-guard';
import { Roles } from 'src/helper/roles.decorator';

import { TransaksiService } from './transaksi.service';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('transaksi')
export class TransaksiController {
  constructor(private transaksiService: TransaksiService) {}

  // =========================
  // GET ALL (SUPER ADMIN)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get()
  findAll() {
    return this.transaksiService.findAll();
  }

  // =========================
  // GET MY TRANSAKSI
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMy(@Req() req: any) {
    return this.transaksiService.getMy(req.user.id);
  }

  // =========================
  // GET DETAIL
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid ID');
    }

    return this.transaksiService.findOne(parsedId);
  }

  @Get('report')
getReport() {
  return this.transaksiService.getReport();
}

  // =========================
  // CREATE TRANSAKSI (UPLOAD FILE)
  // =========================
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('proof', {
      dest: './uploads',
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('BODY:', body);
    console.log('FILE:', file);

    if (!file) {
      throw new BadRequestException('Proof file is required (proof)');
    }

    return this.transaksiService.create(body, file);
  }

  // =========================
  // UPDATE STATUS (SUPER ADMIN)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateStatusDto,
  ) {
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid ID');
    }

    return this.transaksiService.updateStatus(parsedId, body.status);
  }
}