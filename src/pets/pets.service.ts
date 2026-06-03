import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  create(data: any, user: any) {
    return this.prisma.pet.create({
      data: {
        name: data.name,
        type: data.type,
        age: Number(data.age),
        userId: user.id,
      },
    });
  }

  findAll() {
    return this.prisma.pet.findMany({
      include: {
        user: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.pet.findUnique({
      where: { id },
      include: {
        user: true,
        bookings: true,
      },
    });
  }

  myPets(userId: number) {
    return this.prisma.pet.findMany({
      where: { userId },
    });
  }

  update(id: number, data: UpdatePetDto) {
    return this.prisma.pet.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        age: data.age ? Number(data.age) : undefined,
      },
    });
  }

  delete(id: number) {
    return this.prisma.pet.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}