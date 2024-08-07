import { Injectable, Logger } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '@common/services/prisma.service';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { UtilsService } from '@common/services/utils.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
  ) {}

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
  }): Promise<any> {
    const { where, data } = params;
    if (data.avatarUrl) {
      data.avatarUrl = await this.utilsService.saveBase64Image(
        data.avatarUrl as string,
      );
    }
    const user = await this.prisma.user.update({
      data,
      where,
    });

    const BASE_URL = process.env.BASE_URL;
    user.avatarUrl = `${BASE_URL}${data.avatarUrl}`;
    return user;
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
