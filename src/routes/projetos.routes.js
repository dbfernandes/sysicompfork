import express from 'express'
import projetosController from '../controllers/projetosController'

const router = express.Router()

router.get('/adicionar', projetosController.adicionar)
router.post('/adicionar', projetosController.adicionar)
router.get('/listar', projetosController.listar)

export default router
