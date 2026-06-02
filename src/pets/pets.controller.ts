import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

import { PetsService } from './pets.service';
import { JwtAuthGuard } from 'src/helper/jwt-auth.guard';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiBearerAuth('access-token')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  // =========================
  // CREATE PET
  // =========================
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreatePetDto })
  create(@Body() body: CreatePetDto, @Req() req: any) {
    return this.petsService.create(body, req.user);
  }

  // =========================
  // MY PETS
  // =========================
  @Get('my')
  @UseGuards(JwtAuthGuard)
  myPets(@Request() req) {
    return this.petsService.myPets(req.user.id);
  }

  // =========================
  // GET ALL PETS
  // =========================
  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  // =========================
  // GET ONE PET
  // =========================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(Number(id));
  }

  // =========================
  // UPDATE PET
  // =========================
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Body() body: UpdatePetDto, @Param('id') id: string) {
    return this.petsService.update(Number(id), body);
  }

  // =========================
  // DELETE PET
  // =========================
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.petsService.delete(Number(id));
  }
}