import { Injectable } from '@nestjs/common';
import { CryptoDto } from './dto/crypto.dto';

@Injectable()
export class CryptoService {
  crypto(createCryptoDto: CryptoDto) {
    console.log(createCryptoDto);
    const { N, T, D, SEED } = createCryptoDto;
    const TID = SEED + (T - 1);
    const dni = TID / Math.pow(10, 14);
    let x = 0.444666 + dni;
    const r = 3.611 + dni * Math.pow(10, 3);
    const K2 = [];
    const Mk2 = [];

    for (let n = 0; n < N; n++) {
      x = r * x * (1 - x);
      let acuy = 0;
      let acuk = 0;
      const k2 = [];

      for (let c = 1; c <= D; c++) {
        const y = Math.floor(x * Math.pow(10, c)) - acuy * 10;
        acuy += y;
        k2[c - 1] = y % 2 === 0 ? 0 : 1;
        acuk += k2[c - 1] * Math.pow(2, c - 1);
      }

      Mk2[n] = k2; // Matriz de claves en estado binario
      K2[n] = acuk; // Vector de claves donde c/u se expresa como un número entero
    }
    return { Mk2, K2 };
  }
}
