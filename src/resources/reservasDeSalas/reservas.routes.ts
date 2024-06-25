import express from 'express'
import reservasController from './reservas.controller'

const router = express.Router()

router.all('/adicionar', reservasController.adicionar)

router.post('/excluir/:id', reservasController.excluir)

router.get('/gerenciar', reservasController.gerenciar)

router.get('/listar', reservasController.listar)

router.all('/editar/:id', reservasController.editar)

export default router
