import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class ContactDto {
  @ApiProperty({
    description: 'username',
    example: 'John Doe',
    nullable: false,
  })
  @IsNotEmpty()
  display: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+54 11 444-5555',
    nullable: false,
  })
  @IsNotEmpty()
  phoneNumber: string;
}

export class GetContactsDto {
  @ApiProperty({
    description: 'User phone number',
    nullable: false,
    type: [ContactDto],
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];
}
