import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  SetMetadata,
} from '@nestjs/common';

import { GroomingPackageService }
from './grooming-package.service';
import { CreateGroomingPackageDto } from './dto/create-grooming-package.dto';
import { UpdateGroomingPackageDto } from './dto/update-grooming-package.dto';
@ApiBearerAuth('access-token')
@Controller('grooming-package')
export class GroomingPackageController {

  constructor(
    private service:
      GroomingPackageService,
  ) {}

  @Post()
  create(@Body() body: CreateGroomingPackageDto) {
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
  update(@Body() body: UpdateGroomingPackageDto, @Param('id') id: string) {
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

function ApiBearerAuth(arg0: string): (target: typeof GroomingPackageController) => void | typeof GroomingPackageController {
  return SetMetadata('bearerAuth', arg0) as unknown as (target: typeof GroomingPackageController) => void | typeof GroomingPackageController;
}
