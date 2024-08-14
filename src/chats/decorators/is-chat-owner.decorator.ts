import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@auth/guards/auth.guard';

export function IsChatOwner() {
  return applyDecorators(UseGuards(AuthGuard));
}
