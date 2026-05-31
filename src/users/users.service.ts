import {
  Injectable
} from '@nestjs/common';

import { PrismaService }
from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService,
  ) {}

  findAll() {

    return this.prisma.user.findMany({
      select: {
          id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      
    });
  }}
  

//   async findOne(id: number) {

//     const user =
//       await this.prisma.user.findUnique({
//         where: { id },

//         include: {
//           pets: true,
//           bookings: true,
//         },
//       });

//     if (!user) {

//       throw new NotFoundException(
//         'User not found',
//       );
//     }

//     return user;
//   }

//   async update(
//     id: number,
//     data: any,
//   ) {

//     return this.prisma.user.update({
//       where: { id },
//       data,
//     });
//   }

//   async remove(id: number) {

//     return this.prisma.user.delete({
//       where: { id },
//     });
//   }
// }