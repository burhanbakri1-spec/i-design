import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const dynamicImport = new Function('specifier', 'return import(specifier)') as <T>(specifier: string) => Promise<T>;

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}

  async validateImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Image file is required');
    const maxSizeMb = this.configService.get<number>('UPLOAD_MAX_FILE_SIZE_MB') || 10;
    if (file.size > maxSizeMb * 1024 * 1024) {
      throw new BadRequestException(`Image must not exceed ${maxSizeMb}MB`);
    }

    const { fileTypeFromBuffer } = await dynamicImport<typeof import('file-type')>('file-type');
    const detected = await fileTypeFromBuffer(file.buffer);
    if (!detected || !allowedMimeTypes.has(detected.mime)) {
      throw new BadRequestException('Only JPG, PNG, and WEBP images are allowed');
    }
  }

  async uploadProjectImage(file: Express.Multer.File, projectSlug: string) {
    await this.validateImage(file);
    return this.cloudinaryService.uploadImage(file, projectSlug);
  }

  async deleteImage(publicId: string) {
    return this.cloudinaryService.deleteImage(publicId);
  }
}
