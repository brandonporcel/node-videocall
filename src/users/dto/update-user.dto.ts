import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Username',
    example: 'John Doe',
    nullable: true,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({
    description: 'Base 64 profile image',
    example: 'base64',
    nullable: true,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  avatarUrl: string;
}
