import { Auth } from '@auth/decorators/auth.decorator';
import { GetUser } from '@common/decorators/get-user.decorator';
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @Auth()
  getChats(@GetUser() user: User) {
    return this.chatsService.getChats(user);
  }

  @Get('historial/:chatId')
  @Auth()
  getChatHistorial(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @GetUser() user: User,
  ) {
    return this.chatsService.getChatHistorial(chatId);
  }
}
