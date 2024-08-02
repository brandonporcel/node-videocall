import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CryptoDto {
  @ApiProperty()
  @IsInt()
  N: number;

  @ApiProperty()
  @IsInt()
  T: number;

  @ApiProperty()
  @IsInt()
  D: number;

  @ApiProperty()
  @IsInt()
  SEED: number;
}
