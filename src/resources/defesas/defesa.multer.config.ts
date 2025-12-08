import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

// Configuração de armazenamento específica para defesas
const storage = multer.diskStorage({
  destination: function (req: Request, file, callback) {
    // Define o caminho completo da pasta onde o arquivo será salvo
    const uploadDir = path.join(
      __dirname,        // Diretório atual (defesas)
      '..',             // -> resources
      '..',             // -> src
      '..',             // -> raiz do projeto
      'uploads',        // -> uploads
      'defesas',        // -> defesas
      req.params.id     // -> <id_da_defesa>
    );

    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      callback(null, uploadDir);
    } catch (error) {
      console.error("Erro ao criar diretório de upload:", error);
      callback(error as Error, '');
    }
  },
  filename: function (req, file, callback) {
    const fileHash = crypto.randomBytes(10).toString('hex');
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileHash}${fileExtension}`;
    callback(null, fileName);
  },
});

// Configura o Multer (validações e limite)
const defesaUpload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Apenas PDF é permitido.'));
    }
  }
});

export default defesaUpload;