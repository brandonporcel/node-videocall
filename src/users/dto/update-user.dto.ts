import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength, IsBase64 } from 'class-validator';

export class UpdateUserDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  username?: string;
  @IsString()
  @MinLength(1)
  avatarUrl: string;
}
