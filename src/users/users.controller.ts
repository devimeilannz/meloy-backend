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

import { JwtAuthGuard } from 'src/helper/jwt-auth.guard';
import { RolesGuard } from 'src/helper/roles-guard';
import { Roles } from 'src/helper/roles.decorator';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // =====================
  // PROFILE
  // =====================
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: any) {
    return this.usersService.profile(req.user.id);
  }

  // =====================
  // UPDATE PROFILE
  // =====================
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiBody({ type: UpdateUserDto }) // 🔥 Swagger body muncul
  updateProfile(@Req() req: any, @Body() body: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  // =====================
  // DELETE PROFILE
  // =====================
  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  deleteProfile(@Req() req: any) {
    return this.usersService.deleteProfile(req.user.id);
  }

  // =====================
  // GET ALL CUSTOMER (SUPER ADMIN)
  // =====================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // =====================
  // GET USER DETAIL
  // =====================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }
}