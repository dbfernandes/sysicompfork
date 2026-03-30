import multer from 'multer';
import path from 'path';
import { ensureDirectoryExistence } from '@/utils';
import mime from 'mime-types';

// export function generateSlug(fullName: string): string {
//   return fullName
//     .normalize('NFD') // separa acentos
//     .replace(/[\u0300-\u036f]/g, '') // remove acentos
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
//     .replace(/\s+/g, '-') // substitui espaços por hífen
//     .replace(/-+/g, '-'); // evita hífens duplicados
// }

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
      const userId =
        req.body && req.body.professorId
          ? req.body.professorId
          : `guest_${new Date().getTime()}`;

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
      // const nameUser = req.session?.nome ?? crypto.randomUUID();
      // const slug = generateSlug(nameUser);
      const id = req.body.professorId ?? req.session.uid;
      const name = `user-${id}.${ext}`;
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
