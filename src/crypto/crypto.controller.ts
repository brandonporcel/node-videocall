import { Controller, Get, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CryptoDto } from './dto/crypto.dto';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get()
  crypto(@Body() createCryptoDto: CryptoDto) {
    return this.cryptoService.crypto(createCryptoDto);
  }
}
