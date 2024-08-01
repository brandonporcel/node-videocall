import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class UtilsService {
  constructor() {}

  async saveBase64Image(base64String: string): Promise<string> {
    const matches = base64String.match(/^data:image\/(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 string');
    }
    const ext = matches[1];
    const base64Data = matches[2];
    const filename = `${Date.now()}.${ext}`;
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'uploads',
      filename,
    );
    await fs.writeFile(filePath, base64Data, 'base64');
    return `uploads/${filename}`;
  }
}
