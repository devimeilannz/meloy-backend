import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from 'src/helper/jwt-auth.guard';

import { UsersService }
from './users.service';

import { RolesGuard }
from 'src/helper/roles-guard';
import { Roles }from 'src/helper/roles.decorator';

@Controller('users')
export class UsersController {

  constructor(
    private usersService:
      UsersService,
  ) {}

  // GET PROFILE
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(
    @Req() req: any,
  ) {
    return this.usersService.profile(
      req.user.id,
    );
  }

  // UPDATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @Req() req: any,

    @Body()
    body: any,
  ) {
    return this.usersService.updateProfile(
      req.user.id,
      body,
    );
  }

  // DELETE ACCOUNT
  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  deleteProfile(
    @Req() req: any,
  ) {
    return this.usersService.deleteProfile(
      req.user.id,
    );
  }

  // GET ALL CUSTOME
  @UseGuards(
  JwtAuthGuard,
  RolesGuard,
)

@Roles('SUPER_ADMIN')

@Get()
findAll() {
  return this.usersService.findAll();
}

  // GET CUSTOMER DETAIL
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.usersService.findOne(
      Number(id),
    );
  }
}