import express from 'express'
// import salasController from '../controllers/salasController'
import salasController from './salas.controller'

const router = express.Router()

router.all('/adicionar', salasController.adicionar)

router.post('/excluir/:id', salasController.excluir)

router.get('/gerenciar', salasController.gerenciar)

router.all('/editar/:id', salasController.editar)

export default router
