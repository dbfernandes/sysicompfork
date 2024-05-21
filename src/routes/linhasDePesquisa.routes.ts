import express from 'express'
import linhasDePesquisaController from '../controllers/linhasDePesquisaController'
const router = express.Router()

router.get('/listar', linhasDePesquisaController.listar)

router.get('/busca/:id', linhasDePesquisaController.buscar)

router.get('/criar', linhasDePesquisaController.criar)
router.post('/criar', linhasDePesquisaController.criar)
router.post('/remover/:id', linhasDePesquisaController.remover)
router.get('/editar/:id', linhasDePesquisaController.editar)
router.post('/editar/:id', linhasDePesquisaController.editar)

export default router
