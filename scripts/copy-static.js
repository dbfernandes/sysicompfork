const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const fs = require('fs');

// Copiar views principais
fse.copySync('src/views', 'build/views', {
  overwrite: false,
  errorOnExist: false,
});

// Copiar views internas dos resources
const viewDirs = glob.sync('src/resources/**/views', {
  absolute: false,
  nodir: false,
});

for (const dir of viewDirs) {
  const relativePath = path.relative('src', dir); // ex: resources/aluno/views
  const targetPath = path.join('build', relativePath); // ex: build/src/resources/aluno/views
  fse.copySync(dir, targetPath, { overwrite: false, errorOnExist: false });
}

// Copiar arquivos .env para build/ (fora do src)
const envFiles = fs.readdirSync('.').filter((f) => f.startsWith('.env'));
for (const file of envFiles) {
  fse.copySync(file, path.join('build', file), {
    overwrite: false,
    errorOnExist: false,
  });
}
