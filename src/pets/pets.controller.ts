import {
Body,
Controller,
Delete,
Get,
Param,
Patch,
Post,
Req,
Request,
UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PetsService }
from './pets.service';

import { JwtAuthGuard }
from 'src/helper/jwt-auth.guard';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiBearerAuth('access-token')
@Controller('pets')
export class PetsController {

constructor(
private petsService: PetsService,
) {}

@Post()
@UseGuards(JwtAuthGuard)
create(@Body() body: CreatePetDto, @Req() req: any)
{

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
update(@Body() body: UpdatePetDto, @Param('id') id: string) {

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



