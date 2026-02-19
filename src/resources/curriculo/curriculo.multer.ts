import multer from 'multer';
import path from 'path';
import { ensureDirectoryExistence, generateNameHash } from '@/utils';
import mime from 'mime-types';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Avatar
    if (file.fieldname === 'file') {
      const uploadDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'avatar',
      );

      ensureDirectoryExistence(uploadDir);
      return callback(null, uploadDir);
    }

    // Currículo XML
    if (file.fieldname === 'curriculoXML') {
      const userId = req.session?.uid;

      if (!userId) {
        return callback(new Error('Usuário não autenticado'), '');
      }

      const uploadDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'usuario',
        String(userId),
      );

      ensureDirectoryExistence(uploadDir);
      return callback(null, uploadDir);
    }

    callback(new Error('Campo de upload inválido'), '');
  },

  filename: (req: any, file, callback) => {
    // Avatar
    if (file.fieldname === 'file') {
      const ext = mime.extension(file.mimetype) || 'bin';
      const name = generateNameHash(file.fieldname, ext);
      return callback(null, name);
    }

    // Currículo XML
    if (file.fieldname === 'curriculoXML') {
      return callback(null, 'curriculoXML.xml');
    }

    callback(new Error('Campo de upload inválido'), '');
  },
});

const upload = multer({ storage }).fields([
  { name: 'file', maxCount: 1 },
  { name: 'curriculoXML', maxCount: 1 },
]);

export default upload;
