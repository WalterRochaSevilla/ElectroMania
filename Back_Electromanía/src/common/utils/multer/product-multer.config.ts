import { extname, join } from 'path';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const productMulterConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Usar ruta absoluta desde el directorio raíz del proyecto
      cb(null, join(process.cwd(), 'uploads', 'tmp'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
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
    fileSize: 2 * 1024 * 1024, // 2MB
  },
};
