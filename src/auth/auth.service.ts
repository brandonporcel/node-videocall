import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { UsersService } from '@users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '@common/services/prisma.service';
import { OneSignalService } from '@common/services/onesignal.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly oneSignalService: OneSignalService,
  ) {}

  async register({ password, ...userData }: RegisterDto) {
    const users = await this.usersService.users({
      where: {
        OR: [
          {
            email: userData.email,
          },
          {
            phoneNumber: userData.phoneNumber,
          },
        ],
      },
    });

    if (users.length) {
      if (users[0].email === userData.email) {
        throw new BadRequestException('Email already exists');
      } else {
        throw new BadRequestException('Phone already exists');
      }
    }

    const newUser = await this.usersService.createUser({
      password: await bcryptjs.hash(password, 10),
      isValidated: true, //TODO
      avatarUrl: '', //TODO
      ...userData,
    });

    return {
      user: newUser,
      token: await this.generateToken(newUser.id),
    };
  }

  async login({ email, password, oneSignalId }: LoginDto) {
    const user = await this.usersService.user({ email });
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }

    if (oneSignalId) {
      // await this.oneSignalService.deleteOldUser(user.oneSignalId);
      await this.prismaService.user.update({
        where: { id: user.id },
        data: { oneSignalId },
      });
    }

    return {
      user: user,
      token: await this.generateToken(user.id),
    };
  }

  private async generateToken(userId: string) {
    return await this.jwtService.signAsync({ id: userId });
  }

  async logout({ id }: User) {
    return await this.prismaService.user.update({
      where: { id },
      data: { oneSignalId: null },
    });
  }
}
