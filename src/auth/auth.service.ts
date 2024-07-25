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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ password, ...userData }: RegisterDto) {
    const user = await this.usersService.user({ email: userData.email });

    if (user) {
      throw new BadRequestException('Email already exists');
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

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.user({ email });
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }

    return {
      user: user,
      token: await this.generateToken(user.id),
    };
  }

  private async generateToken(userId: string) {
    return await this.jwtService.signAsync({ id: userId });
  }
}
