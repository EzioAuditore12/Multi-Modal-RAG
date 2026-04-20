import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';

const DESTINATION_LOCATION = 'public';
const FILE_SIZE = 10000000; // 10mb

const storage = multer.diskStorage({
  destination: DESTINATION_LOCATION,
  filename: function (req, file, cb) {
    const uuid = crypto.randomUUID();
    cb(
      null,
      uuid +
        '-' +
        file.fieldname +
        '-' +
        Date.now() +
        path.extname(file.originalname),
    );
  },
});

export const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: FILE_SIZE },
}).single('file');
