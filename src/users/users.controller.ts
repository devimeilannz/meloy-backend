import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
} from '@nestjs/common';

import { UsersService }
from './users.service';

@Controller('users')
export class UsersController {

  constructor(
    private usersService: UsersService,
  ) {}

  @Get()
  findAll() {

    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {

    return this.usersService.findOne(
      +id,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body() body: any,
  ) {

    return this.usersService.update(
      +id,
      body,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {

    return this.usersService.remove(
      +id,
    );
  }
}