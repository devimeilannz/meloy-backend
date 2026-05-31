import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { PetsService } from './pets.service';

import { JwtAuthGuard }
from 'src/helper/jwt-auth.guard';

@Controller('pets')
export class PetsController {

  constructor(
    private petsService: PetsService,
  ) {}

  
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() body: any,
    @Request() req,
  ) {

    return this.petsService.create(
      body,
      req.user,
    );
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {

    return this.petsService.findAll();
  }
}