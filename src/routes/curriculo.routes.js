import express from 'express'
import curriculoController from '../controllers/curriculoController'
const router = express.Router()

router.get('/', curriculoController.visualizar)
router.post('/upload', curriculoController.carregar)

export default router