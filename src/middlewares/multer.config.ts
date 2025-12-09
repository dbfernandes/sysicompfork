import multer from 'multer';
import path from 'path';
import { ensureDirectoryExistence, generateNameHash } from '@/utils';
import mime from 'mime-types';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = path.join(__dirname, '..', '..', 'public', 'avatar');
    ensureDirectoryExistence(uploadDir);
    callback(null, uploadDir);
  },
  filename: (req, { fieldname, mimetype }, callback) => {
    console.log(mime.extension(mimetype));
    const name = generateNameHash(fieldname, mime.extension(mimetype) || 'bin');
    callback(null, name);
  },
});

const upload = multer({ storage }).single('file');

export default upload;
