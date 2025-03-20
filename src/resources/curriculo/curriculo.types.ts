import { Request } from 'express';

export interface UploadRequestBody {
  professorId: number;
  publicacoes: string;
  premios: string;
  info: string;
  projetos: string;
  orientacoes: string;
}

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
