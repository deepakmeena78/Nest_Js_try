import { Module } from '@nestjs/common';
import { UploadController } from './multer.controller';
import { UploadService } from './multer.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
