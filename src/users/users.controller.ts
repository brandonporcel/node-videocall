import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsUserOwner } from './decorators/is-user-owner.decorator';
import { Auth } from '@auth/decorators/auth.decorator';
import { TransformUserInterceptor } from '@auth/interceptors/user.interceptor';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(TransformUserInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth()
  users(@Query() args: UserPaginationDto) {
    return this.usersService.users(args);
  }

  @Get(':userId')
  @Auth()
  user(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.userOrThrow({ id: userId });
  }

  @Patch(':userId')
  @IsUserOwner()
  updateUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(
      {
        where: { id: userId },
        data: updateUserDto,
      },
      userId,
    );
  }

  @Delete(':userId')
  @IsUserOwner()
  deleteUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.deleteUser({ id: userId });
  }
}
