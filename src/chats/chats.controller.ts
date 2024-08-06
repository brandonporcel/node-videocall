import { Auth } from '@auth/decorators/auth.decorator';
import { GetUser } from '@common/decorators/get-user.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ChatsService } from './chats.service';
import { SearchDto } from './dto/search.dto';

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

  @Post('search')
  @Auth()
  search(@GetUser() user: User, @Body() searchDto: SearchDto) {
    return this.chatsService.search(searchDto);
  }
}
