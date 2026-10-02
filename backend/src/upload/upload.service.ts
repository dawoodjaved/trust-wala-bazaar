import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadRoot: string;
  private readonly baseUrl: string;

  constructor(private config: ConfigService) {
    this.uploadRoot = join(process.cwd(), 'uploads');
    const port = this.config.get('PORT') || 3001;
    this.baseUrl =
      this.config.get('PUBLIC_API_URL') ||
      this.config.get('NEXT_PUBLIC_API_URL') ||
      `http://localhost:${port}`;
    for (const dir of ['images', 'videos']) {
      const path = join(this.uploadRoot, dir);
      if (!existsSync(path)) mkdirSync(path, { recursive: true });
    }
  }

  private saveFile(file: Express.Multer.File, folder: 'images' | 'videos'): string {
    const ext = extname(file.originalname) || (folder === 'images' ? '.jpg' : '.webm');
    const filename = `${randomUUID()}${ext}`;
    const dest = join(this.uploadRoot, folder, filename);
    writeFileSync(dest, file.buffer);
    return `${this.baseUrl}/uploads/${folder}/${filename}`;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return this.saveFile(file, 'images');
  }

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    return this.saveFile(file, 'videos');
  }
}
