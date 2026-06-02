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
import {
  ApiBearerAuth,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/helper/jwt-auth.guard';
import { RolesGuard } from 'src/helper/roles-guard';
import { Roles } from 'src/helper/roles.decorator';

import { TransaksiService } from './transaksi.service';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Transaksi')
@ApiBearerAuth('access-token')
@Controller('transaksi')
export class TransaksiController {
  constructor(private transaksiService: TransaksiService) {}

  // =========================
  // CREATE TRANSAKSI (FIX SWAGGER)
  // =========================
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bookingId: { type: 'number' },
        total: { type: 'number' },
        proof: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['bookingId', 'total', 'proof'],
    },
  })
  @UseInterceptors(
    FileInterceptor('proof', {
      dest: './uploads',
    }),
  )
  create(
    @Body() body: CreateTransaksiDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Proof file is required');
    }

    return this.transaksiService.create(body, file, req.user);
  }

  // =========================
  // GET ALL
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
  // GET REPORT
  // =========================
  @Get('report')
  getReport() {
    return this.transaksiService.getReport();
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

  // =========================
  // UPDATE STATUS
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid ID');
    }

    return this.transaksiService.updateStatus(parsedId, body.status);
  }
}