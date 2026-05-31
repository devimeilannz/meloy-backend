import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { UsersService }
from './users.service';

import { JwtAuthGuard }
from 'src/helper/jwt-auth.guard';

import {Roles} from 'src/helper/roles.decorator';

import { RolesGuard }
from 'src/helper/roles-guard';


@Controller('users')
export class UsersController {
constructor(
    private usersService:
      UsersService,
  ) {}

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('SUPER_ADMIN')
  @Get()
  findAll() {

    return this.usersService.findAll();
  }
}