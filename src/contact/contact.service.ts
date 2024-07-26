import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { User } from '@prisma/client';
import { PrismaService } from '@common/services/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(user: User) {
    return this.prismaService.contact.findMany({
      where: {
        ownerId: user.id,
        targetId: { not: null },
      },
    });
  }

  update(user: User, createContactDto: CreateContactDto) {
    const contacts = createContactDto.contacts;
    this.prismaService.contact.deleteMany({
      where: {
        ownerId: user.id,
        phoneNumber: {
          notIn: contacts.map((contact) => contact.phoneNumber.trim()),
        },
      },
    });

    const promises = contacts.map(async (contact) => {
      const target = await this.prismaService.user.findFirst({
        where: { phoneNumber: contact.phoneNumber },
      });
      const targetId = target?.id;
      return this.prismaService.contact.upsert({
        where: {
          ownerId_phoneNumber: {
            ownerId: user.id,
            phoneNumber: contact.phoneNumber.trim(),
          },
        },
        update: {
          display: contact.display,
          targetId: targetId,
        },
        create: {
          display: contact.display,
          phoneNumber: contact.phoneNumber,
          ownerId: user.id,
          targetId: targetId,
        },
      });
    });
    return Promise.all(promises);
  }
}
