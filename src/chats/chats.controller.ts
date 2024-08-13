import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Auth } from '@auth/decorators/auth.decorator';
import { GetUser } from '@common/decorators/get-user.decorator';
import { ChatsService } from './chats.service';
import { SearchDto } from './dto/search.dto';
import { ChatsDto } from './dto/chats.dto';
import { IsChatOwner } from './decorators/is-chat-owner.decorator';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @Auth()
  getChats(@GetUser() user: User, @Body() chatsDto: ChatsDto) {
    return this.chatsService.getChats(user, chatsDto);
  }

  @Get(':targetId')
  @Auth()
  getChat(@Param('targetId') targetId: string, @GetUser() user: User) {
    return this.chatsService.getChat(user.id, targetId);
  }

  @Get('historial/:chatId')
  @Auth()
  getChatHistorial(@Param('chatId', ParseUUIDPipe) chatId: string) {
    return this.chatsService.getChatHistorial(chatId);
  }

  @Post('search')
  @Auth()
  search(@Body() searchDto: SearchDto) {
    return this.chatsService.search(searchDto);
  }

  @Delete(':chatId')
  @IsChatOwner()
  deleteChat(@Param('chatId', ParseUUIDPipe) chatId: string) {
    return this.chatsService.deleteChat(chatId);
  }
}
