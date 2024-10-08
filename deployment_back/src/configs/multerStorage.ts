import crypto from 'node:crypto';
import { diskStorage } from 'multer';
import { Request } from 'express';
import path from 'node:path';

// const srcPath = path.join(__dirname, '..', '..');

export const storage = diskStorage({
  // destination: path.join(srcPath, 'uploads', 'files'),
  destination: 'uploads',
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + crypto.randomBytes(20).toString('hex');
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
