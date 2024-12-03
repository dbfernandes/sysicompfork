import { Request } from 'express';

// Interface para o corpo da requisição
export interface UploadRequestBody {
  professorId: number;
  publicacoes: string; // JSON string
  premios: string; // JSON string
  info: string; // JSON string
  projetos: string; // JSON string
  orientacoes: string; // JSON string
}

// Extendendo o tipo Request do Express
export interface UploadRequest extends Request {
  body: UploadRequestBody;
  file?: Express.Multer.File;
}
export interface UploadRequestBody {
  publicacoes: string;
  professorId: number;
  premios: string;
  info: string;
  projetos: string;
  orientacoes: string;
}
export interface UploadRequestFile {
  filename: string;
  path: string;
}
