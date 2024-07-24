import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserWithPermissions } from '@users/interfaces/user-profile.interface';
import { UsersService } from '@users/users.service';

@Injectable()
export class IsUserOwnerGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;

    const user: UserWithPermissions = request.user;
    if (!user) throw new BadRequestException('User not found');

    const targetUserId = params.userId;
    if (!targetUserId) throw new BadRequestException('Target user not found');

    const targetUser = await this.usersService.user({ id: targetUserId });
    if (!targetUser) throw new BadRequestException('Target user not found');

    return user.id === targetUser.id;
  }
}
