import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { CLOUDINARY } from './cloudinary.constants';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY) private readonly client: typeof cloudinary,
    private readonly configService: ConfigService,
  ) {}

  async uploadImage(file: Express.Multer.File, projectSlug: string): Promise<UploadApiResponse> {
    this.ensureConfigured();
    const folder = `${this.configService.get<string>('CLOUDINARY_PROJECT_FOLDER') || 'architecture-projects'}/${projectSlug}`;

    return new Promise((resolve, reject) => {
      const uploadStream = this.client.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(new ServiceUnavailableException('Image upload failed'));
            return;
          }
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string) {
    this.ensureConfigured();
    const result = await this.client.uploader.destroy(publicId, { resource_type: 'image' });
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new ServiceUnavailableException('Image deletion failed');
    }
  }

  private ensureConfigured() {
    if (
      !this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
      !this.configService.get<string>('CLOUDINARY_API_KEY') ||
      !this.configService.get<string>('CLOUDINARY_API_SECRET')
    ) {
      throw new ServiceUnavailableException('Cloudinary is not configured');
    }
  }
}
