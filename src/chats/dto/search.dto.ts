import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class SearchDto {
  @ApiProperty({
    description: 'Contacts search',
    example: 'Le',
    nullable: false,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  query: string;

  @ApiProperty({
    description: 'List of contacts to search of',
    example: "[{display:'Leandro Piñeiro', phoneNumber:'11 2233 4455'}]",
    nullable: false,
  })
  contacts: string[];
}
