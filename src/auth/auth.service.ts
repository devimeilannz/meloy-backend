import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // =========================
  // REGISTER
  // =========================
  async register(data: any) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExist) {
      throw new BadRequestException('Email already used');
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashed,
        role: data.role || 'CUSTOMER',
      },
    });

    return {
      message: 'Register success',
      data: user,
    };
  }

  // =========================
  // LOGIN
  // =========================
  async login(data: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const valid = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!valid) {
      throw new BadRequestException('Wrong password');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Login success',
      token,
    };
  }

}