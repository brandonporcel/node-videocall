import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@auth/guards/auth.guard';
import { IsUserOwnerGuard } from '@users/guards/is-user-owner.guard';

export function IsUserOwner() {
  return applyDecorators(UseGuards(AuthGuard, IsUserOwnerGuard));
}
