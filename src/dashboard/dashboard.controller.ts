import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { DashboardService }
from './dashboard.service';

import { JwtAuthGuard }
from 'src/helper/jwt-auth.guard';

import { RolesGuard }
from 'src/helper/roles-guard';

import { Roles }
from 'src/helper/roles.decorator';

@Controller('dashboard')
export class DashboardController {

  constructor(
    private dashboardService:
      DashboardService,
  ) {}

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )

  @Roles('SUPER_ADMIN')

  @Get()

  summary() {

    return this.dashboardService.summary();
  }
}