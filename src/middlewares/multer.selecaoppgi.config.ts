import multer from 'multer';
import fs from 'fs';
// Função para garantir que o diretório exista, se não, cria-o
const ensureDirectoryExistence = (filePath) => {
  const parts = filePath.split('/');
  let currentPath = '';

  for (let i = 0; i < parts.length; i++) {
    currentPath += parts[i] + '/';

    if (!fs.existsSync(currentPath)) {
      console.log('Diretório não existe, criando:', currentPath);
      fs.mkdirSync(currentPath);
    }
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(file);
    const uploadDir = `./public/uploads/candidato/${req.session.uid}`;
    ensureDirectoryExistence(uploadDir);
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    console.log(file);
    const name = `${file.fieldname}.pdf`;
    callback(null, name);
  },
});

const uploads = multer({ storage }).fields([
  { name: 'Curriculum', maxCount: 1 },
  { name: 'ProvaAnterior', maxCount: 1 },
  { name: 'VitaeXML', maxCount: 1 },
]);

const uploadsProposta = multer({ storage }).fields([
  { name: 'PropostaTrabalho', maxCount: 1 },
  { name: 'ComprovantePagamento', maxCount: 1 },
  { name: 'CartaAceiteOrientador', maxCount: 1 },
]);

export { uploads, uploadsProposta };
