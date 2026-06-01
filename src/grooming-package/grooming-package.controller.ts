import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { GroomingPackageService }
from './grooming-package.service';

@Controller('grooming-package')
export class GroomingPackageController {

  constructor(
    private service:
      GroomingPackageService,
  ) {}

  @Post()
  create(
    @Body() body: any,
  ) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.service.findOne(
      Number(id),
    );
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    body: any,
  ) {
    return this.service.update(
      Number(id),
      body,
    );
  }

  @Delete(':id')
  delete(
    @Param('id')
    id: string,
  ) {
    return this.service.delete(
      Number(id),
    );
  }
}