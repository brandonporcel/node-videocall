import { Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class UserPaginationDto {
  @IsOptional()
  skip?: number;

  @IsOptional()
  take?: number;

  @IsOptional()
  cursor?: Prisma.UserWhereUniqueInput;

  @IsOptional()
  where?: Prisma.UserWhereInput;

  @IsOptional()
  orderBy?: Prisma.UserOrderByWithRelationInput;
}
