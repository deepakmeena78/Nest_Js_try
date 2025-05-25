import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class UploadService {
  getStorageOptions() {
    return {
      storage: diskStorage({
        destination: './uploads', // Folder where files will be stored
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname); // Get file extension
          const fileName = `uploaded-${uniqueSuffix}${fileExt}`; // Custom file name
          cb(null, fileName);
        },
      }),
    };
  }
}
