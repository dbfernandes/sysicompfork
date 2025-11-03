import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { slugify } from '@utils/slugify';

const UPLOADS_DIR =
  process.env.BPMN_UPLOAD_DIR || path.resolve(process.cwd(), 'uploads', 'bpmn');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const base = slugify(
      String(req.body?.titulo || file.originalname).replace(/\.[^.]+$/, ''),
    );
    const ext = path.extname(file.originalname || '.bpmn') || '.bpmn';
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

function fileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const ok = ['.xml', '.bpmn'].includes(
    path.extname(file.originalname).toLowerCase(),
  );
  if (!ok) return cb(new Error('Apenas arquivos .xml ou .bpmn são permitidos'));
  cb(null, true);
}

export const uploadXml = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
