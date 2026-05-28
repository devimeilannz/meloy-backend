import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { PetsService } from './pets.service';
import { UseGuards }
from '@nestjs/common';

import { JwtAuthGuard }
from 'src/helper/jwt-auth.guard';

@Controller('pets')
export class PetsController {

  constructor(
    private petsService: PetsService,
  ) {}

  @Post()
  create(@Body() body: any) {

    return this.petsService.create(body);
  }

  @Get()

@UseGuards(JwtAuthGuard)

findAll() {

  return this.petsService.findAll();
}
  }
