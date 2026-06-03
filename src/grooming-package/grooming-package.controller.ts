import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { GroomingPackageService } from './grooming-package.service';
import { CreateGroomingPackageDto } from './dto/create-grooming-package.dto';
import { UpdateGroomingPackageDto } from './dto/update-grooming-package.dto';

@ApiTags('Grooming Package')
@ApiBearerAuth('access-token')
@Controller('grooming-package')
export class GroomingPackageController {
  constructor(private service: GroomingPackageService) {}

 
  @Post()
  @ApiBody({ type: CreateGroomingPackageDto })
  create(@Body() body: CreateGroomingPackageDto) {
    return this.service.create(body);
  }

 
  // GET ALL
  
  @Get()
  findAll() {
    return this.service.findAll();
  }

 
  // GET ONE
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

 
  @Patch(':id')
  @ApiBody({ type: UpdateGroomingPackageDto }) // 🔥 INI YANG WAJIB
  update(
    @Body() body: UpdateGroomingPackageDto,
    @Param('id') id: string,
  ) {
    return this.service.update(Number(id), body);
  }

  
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}