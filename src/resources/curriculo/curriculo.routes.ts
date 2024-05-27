import express from 'express'
import multer from 'multer'
import curriculoController from './curriculo.controller'
import { Request, Response } from 'express'
import path from 'path'
const storage = multer.diskStorage({ // configuração do armazenamento das imagens
  destination: (req, file, callback) => {
    // callback(null, __dirname+ "/../uploads/"); // caminho '/src/uploads'
    callback(null, path.join(__dirname, '..', 'uploads')) // caminho '/src/uploads'
  },
  filename: (req, file, callback) => {
    const id = req.body.idProfessor
    callback(null, `${new Date().getTime()}-${id}-` + file.originalname)
  }
})

const uploads = multer({ storage }).single('file') // intanciando o middleware
const router = express.Router()

router.all('/', curriculoController.visualizar)

router.all('/avatar/:id', curriculoController.verificarAvatar)

router.all('/upload', (req, res) => {
  uploads(req, res, function (err) { // Executando o middleware antes do controller para tratar erros
    if (err) { // Caso haja erro no armazenamento da imagem
      return res.status(500).send()
    }
    curriculoController.carregar(req, res) // Execução do controller
  })
}
)

export default router
