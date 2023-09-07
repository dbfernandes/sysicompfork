import express from 'express'
import usurarioRouter from '../controllers/usuariosController'
const router = express.Router()
const { Usuario } = require('../models')

router.all('/adicionar', usurarioRouter.adicionar)
router.get('/listar', usurarioRouter.listar) 
router.all('/deletar/:id', usurarioRouter.deletar)
router.get('/dados/:id', usurarioRouter.visualizar)
router.all('/editar/:id', usurarioRouter.editar)

export default router