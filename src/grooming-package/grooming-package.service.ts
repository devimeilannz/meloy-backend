import { Injectable } from '@nestjs/common';

@Injectable()
export class GroomingPackageService {

  private packages = [
    {
      id: 1,
      name: 'Basic Grooming',
      price: 50000,
      description: 'Mandi + pengeringan',
    },
    {
      id: 2,
      name: 'Regular Grooming',
      price: 80000,
      description: 'Mandi + potong kuku + telinga',
    },
    {
      id: 3,
      name: 'Premium Grooming',
      price: 120000,
      description: 'Full treatment grooming',
    },
  ];

  findAll() {
    return this.packages;
  }

  findOne(id: number) {
    return this.packages.find(
      (item) => item.id === Number(id),
    );
  }
}