import { Controller, Get, Body, Put } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactService } from './contact.service';
import { GetUser } from '@common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get(':contactId/users/:userId')
  findAll(@GetUser() user: User) {
    return this.contactService.findAll(user);
  }

  @Put()
  update(@GetUser() user: User, @Body() contacts: CreateContactDto[]) {
    return this.contactService.update(user, contacts);
  }
}