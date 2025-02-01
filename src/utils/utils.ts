import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';

const roundsSalt = process.env.SALT_ROUNDS || 10;

export async function generateHashPassword(password: string) {
  const salt = await bcrypt.genSalt(Number(roundsSalt));
  return await bcrypt.hash(password, salt);
}

/**
 * Determina o tipo MIME com base na extensão do arquivo.
 * @param {string} filename - Nome do arquivo.
 * @returns {string} - Tipo MIME.
 */
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Converte uma imagem para uma string Base64.
 * @param {string} imagePath - Caminho para a imagem.
 * @returns {string} - String Base64 da imagem.
 */
export async function getBase64Image(imagePath: string): Promise<string> {
  const absolutePath = path.resolve(__dirname, '..', '..', imagePath);
  const imageBuffer = await fs.readFile(absolutePath);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = getMimeType(imagePath);
  return `data:${mimeType};charset=utf-8;base64,${base64Image}`;
}
