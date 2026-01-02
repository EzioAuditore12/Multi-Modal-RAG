import multer from 'multer';
import { randomUUID } from 'node:crypto';

export function createMulterUpload(
  allowedTypes: string[] = ['image/png', 'image/jpg', 'image/jpeg'],
) {
  const fileStorage = multer.diskStorage({
    destination: (_req, _file, callback) => {
      const dir = './public/temp';
      callback(null, dir);
    },
    filename: (_req, file, callback) => {
      const uniqueName = `${Date.now()}-${randomUUID()}-${file.originalname}`;
      callback(null, uniqueName);
    },
  });

  const fileFilter: multer.Options['fileFilter'] = (_req, file, callback) => {
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new multer.MulterError(
          'LIMIT_UNEXPECTED_FILE',
          `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`,
        ),
      );
    }
  };

  return multer({ storage: fileStorage, fileFilter });
}

export const uploadImages = createMulterUpload(['image/png', 'image/jpeg']);
