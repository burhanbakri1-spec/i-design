import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { UploadService } from './upload.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService, UploadService],
  exports: [UploadService],
})
export class UploadModule {}
