import express from 'express'
import selecaoppgiController from '../controllers/selecaoppgiController'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

const router = express.Router()

// Função para garantir que o diretório exista, se não, cria-o
const ensureDirectoryExistence = (filePath) => {
  const parts = filePath.split('/')
  let currentPath = ''

  for (let i = 0; i < parts.length; i++) {
    currentPath += parts[i] + '/'

    if (!fs.existsSync(currentPath)) {
      console.log('Diretório não existe, criando:', currentPath)
      fs.mkdirSync(currentPath)
    }
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(file) 
    const uploadDir = `./uploads/candidatos/${req.session.uid}`
    ensureDirectoryExistence(uploadDir)
    callback(null, uploadDir)
  },
  filename: function (req, file, callback) {
    console.log(file)
    const name = `${file.fieldname}.pdf`
    callback(null, name)
  }
})

const uploads = multer({ storage }).fields([
  { name: 'VitaePDF', maxCount: 1 },
  { name: 'ProvaAnterior', maxCount: 1 },
  { name: 'VitaeXML', maxCount: 1 }
])

const uploadsProposta = multer({ storage }).fields([
  { name: 'PropostaTrabalho', maxCount: 1 },
  { name: 'ComprovantePagamento', maxCount: 1 },
  { name: 'CartaAceiteOrientador', maxCount: 1 }
])

/* TODO - Add routes */
router.all('/', selecaoppgiController.begin)
router.all('/cadastro', selecaoppgiController.signUp)
router.all('/entrar', selecaoppgiController.login)
router.all('/logout', selecaoppgiController.logout)
router.all('/editCandidate', selecaoppgiController.editCandidate)
router.all('/formulario/1', selecaoppgiController.form1)
router.all('/formulario/2', (req, res) => { 
  uploads(req, res, function (err) {
    if (err) {
      console.error('Erro ao fazer upload de arquivos:')
      console.error(err)
      throw err
    }
    selecaoppgiController.form2(req, res)
  })
})
router.all('/trocarSenha', selecaoppgiController.trocarSenha)
router.all('/formulario/3', (req, res) => { 
  uploadsProposta(req, res, function (err) {
    if (err) {
      console.error('Erro ao fazer upload de arquivos:')
      console.error(err)
      throw err
    }
    selecaoppgiController.formProposta(req, res)
  })
})

router.all('/formulario/publicacoes', (req, res) => {
  uploads(req, res, function (err) {
    if (err) {
      console.log(err)
      throw err
    }
    selecaoppgiController.formPublicacoes(req, res)
  })
})

router.all('/formulario', selecaoppgiController.forms)
router.all('/candidates', selecaoppgiController.candidates)
router.all('/voltar', selecaoppgiController.voltar)
router.all('/recuperarSenha',selecaoppgiController.recuperarSenha)

router.all('/voltarInicio', selecaoppgiController.backToStart)
router.get('/download/arquivo/:name', (req, res) => {
  // Define o caminho do arquivo
 
  const userId = req.session.uid.toString() 
  const nomeArquivo = req.params.name
  const caminhoArquivo = path.join(__dirname, '..', '..', 'uploads', 'candidatos', userId, nomeArquivo)
  // Verifica se o arquivo existe
  if (fs.existsSync(caminhoArquivo)) {
    // Define o cabeçalho para o download
    // Define os cabeçalhos para evitar o armazenamento em cache
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.setHeader('Content-Disposition', `attachment; filename=${nomeArquivo}`)
    res.setHeader('Content-Type', 'application/octet-stream')

    // Envia o arquivo como resposta
    res.sendFile(caminhoArquivo)
  } else {
    res.status(404).send('Arquivo não encontrado.')
  }
})
export default router
