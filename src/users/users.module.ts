import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { AuthModule } from '@auth/auth.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [CommonModule, forwardRef(() => AuthModule)],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
