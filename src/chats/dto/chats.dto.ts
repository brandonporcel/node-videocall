import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class SimpleContact {
  @IsNotEmpty()
  display: string;
  @IsNotEmpty()
  phoneNumber: string;
}

export class ChatsDto {
  @ApiProperty({
    description: 'List of contacts',
    example: [{ display: 'Brandon Porcel', phoneNumber: '11 2233 4455' }],
    nullable: false,
    type: [SimpleContact],
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SimpleContact)
  contacts: SimpleContact[];
}
