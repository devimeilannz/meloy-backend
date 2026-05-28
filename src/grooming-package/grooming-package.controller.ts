import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { GroomingPackageService }
from './grooming-package.service';

@Controller('grooming-package')
export class GroomingPackageController {

  constructor(
    private service:
      GroomingPackageService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.service.findOne(+id);
  }
}