import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs/promises';

const roundsSalt = process.env.SALT_ROUNDS || 10;

export async function generateHashPassword(password: string) {
  const salt = await bcrypt.genSalt(Number(roundsSalt));
  return await bcrypt.hash(password, salt);
}

export async function verificarArquivoDiretorio(
  diretorio: string,
  nomeArquivo: string,
): Promise<boolean> {
  const caminhoArquivo = path.join(diretorio, nomeArquivo);

  try {
    // verifica se o arquivo é acessível (F_OK ⇒ existe)
    await fs.access(caminhoArquivo, fs.constants.F_OK);
    return true;
  } catch {
    return false; // cai aqui se o arquivo não existir ou não houver permissão
  }
}
