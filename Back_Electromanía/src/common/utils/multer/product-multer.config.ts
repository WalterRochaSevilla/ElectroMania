import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const productMulterConfig = {
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(
        new BadRequestException('Solo imágenes'),
        false,
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB - increased for high quality images
  },
};

