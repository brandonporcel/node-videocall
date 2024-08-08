import { Injectable } from '@nestjs/common';
import { ChatType, User } from '@prisma/client';
import { PrismaService } from '@common/services/prisma.service';
import { GetContactsDto } from './dto/get-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  async getContacts(user: User, getContactsDto: GetContactsDto) {
    const phoneNumbers = getContactsDto.contacts.map(
      (contact) => contact.phoneNumber,
    );

    const matchingUsers = await this.prismaService.user.findMany({
      where: {
        phoneNumber: {
          in: phoneNumbers,
        },
      },
      include: {
        UserChat: {
          include: {
            Chat: {
              include: {
                UserChat: {
                  where: {
                    userId: {
                      not: user.id,
                    },
                  },
                  include: { User: true },
                },
              },
            },
          },
          where: {
            Chat: {
              type: ChatType.direct,
              UserChat: {
                some: {
                  userId: user.id,
                },
              },
            },
          },
        },
      },
    });
    matchingUsers.forEach((user) => {
      if (user.UserChat.length) {
        user.UserChat[0].Chat.name = user.username;
      }
    });

    return {
      filtered: matchingUsers,
      forInvite: phoneNumbers.filter(
        (x) => !matchingUsers.some((y) => y.phoneNumber === x),
      ),
    };
  }

  // findAll(user: User) {
  //   return this.prismaService.contact.findMany({
  //     where: {
  //       ownerId: user.id,
  //       targetId: { not: null },
  //     },
  //   });
  // }

  // update(user: User, createContactDto: CreateContactDto) {
  //   const contacts = createContactDto.contacts;
  //   this.prismaService.contact.deleteMany({
  //     where: {
  //       ownerId: user.id,
  //       phoneNumber: {
  //         notIn: contacts.map((contact) => contact.phoneNumber.trim()),
  //       },
  //     },
  //   });

  //   const promises = contacts.map(async (contact) => {
  //     const target = await this.prismaService.user.findFirst({
  //       where: { phoneNumber: contact.phoneNumber },
  //     });
  //     const targetId = target?.id;
  //     return this.prismaService.contact.upsert({
  //       where: {
  //         ownerId_phoneNumber_unique: {
  //           ownerId: user.id,
  //           phoneNumber: contact.phoneNumber.trim(),
  //         },
  //       },
  //       update: {
  //         display: contact.display,
  //         targetId: targetId,
  //       },
  //       create: {
  //         display: contact.display,
  //         phoneNumber: contact.phoneNumber,
  //         ownerId: user.id,
  //         targetId: targetId,
  //       },
  //     });
  //   });
  //   return Promise.all(promises);
  // }
}
