import { Module } from '@nestjs/common';
import { PasswordService } from './utils/password.service';
import config from '../config/Configuration';
import { CryptoService } from './utils/security/crypto.service';
import { CloudinaryImageStorage } from './utils/storage/cloudinary-image.storage';
import { R2ImageStorage } from './utils/storage/r2-image-storage.storage';
import { LocalImageStorage } from './utils/storage/local-image.storage';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PasswordService,
    CryptoService,
    {
      provide: 'ImageStorage',
      useFactory: () => {
        const driver = config().storage.driver;
        switch (driver) {
          case 'cloudinary':
            return new CloudinaryImageStorage();
          case 'r2':
            return new R2ImageStorage();
          default:
            return new LocalImageStorage();
        }
      },
    },
  ],
  exports: [PasswordService, CryptoService, 'ImageStorage'],
})
export class CommonModule {}
