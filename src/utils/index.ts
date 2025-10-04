import fs from 'fs';
import crypto from 'crypto';

export default function construirStringPerfisDeUsuario(usuario: any) {
  let perfis = '';
  if (usuario.get().administrador === '1') perfis += ' Administrador |';
  if (usuario.get().coordenador === '1') perfis += ' Coordenador |';
  if (usuario.get().professor === '1') perfis += ' Professor |';
  if (usuario.get().secretaria === '1') perfis += ' Secretaria';

  if (perfis.endsWith(' |')) {
    perfis = perfis.substring(0, perfis.length - 2);
  }

  return {
    ...usuario.get(),
    perfis,
  };
}

export const ensureDirectoryExistence = (filePath: string) => {
  const parts = filePath.split('/');
  let currentPath = '';

  for (let i = 0; i < parts.length; i++) {
    currentPath += parts[i] + '/';

    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
};

export function generateNameHash(input: string, extension: string): string {
  const hash = crypto
    .createHash('sha1') // ou "md5", "sha256"
    .update(input)
    .digest('hex');
  return `${hash}.${extension}`;
}
