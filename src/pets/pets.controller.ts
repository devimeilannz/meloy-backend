import {
Body,
Controller,
Delete,
Get,
Param,
Patch,
Post,
Request,
UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PetsService }
from './pets.service';

import { JwtAuthGuard }
from 'src/helper/jwt-auth.guard';

@ApiBearerAuth('access-token')
@Controller('pets')
export class PetsController {

constructor(
private petsService: PetsService,
) {}

@Post()
@UseGuards(JwtAuthGuard)
create(
@Body() body: any,
@Request() req,
) {

return this.petsService.create(
  body,
  req.user,
);


}

@UseGuards(JwtAuthGuard)
@Get('my')
myPets(
@Request() req,
) {


return this.petsService.myPets(
  req.user.id,
);


}

@Get()
findAll() {


return this.petsService.findAll();


}

@Get(':id')
findOne(
@Param('id')
id: string,
) {


return this.petsService.findOne(
  Number(id),
);


}

@UseGuards(JwtAuthGuard)
@Patch(':id')
update(
@Param('id')
id: string,


@Body()
body: any,


) {


return this.petsService.update(
  Number(id),
  body,
);


}

@UseGuards(JwtAuthGuard)
@Delete(':id')
delete(
@Param('id')
id: string,
) {


return this.petsService.delete(
  Number(id),
);


}
}


