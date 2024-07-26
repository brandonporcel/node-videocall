import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '@common/services/prisma.service';
import { UserPaginationDto } from './dto/user-pagination.dto';
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async users(params: UserPaginationDto): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async authUser(id: string) {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async userOrThrow(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: userWhereUniqueInput,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async saveBase64Image(base64String: string): Promise<string> {
    const matches = base64String.match(/^data:image\/(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 string');
    }
    const ext = matches[1];
    const base64Data = matches[2];
    const filename = `${uuidv4()}.${ext}`;
    const filePath = path.join(__dirname, '..', 'public', 'uploads', filename);
    await fs.writeFile(filePath, base64Data, 'base64');
    return `/uploads/${filename}`;
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
