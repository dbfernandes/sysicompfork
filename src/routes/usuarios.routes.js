import express from 'express'
import usurarioRouter from '../controllers/usuariosController'
const router = express.Router()
const { Usuario } = require('../models')

router.all('/adicionar', usurarioRouter.adicionar)
router.get('/listar', usurarioRouter.listar) 
router.all('/deletar/:id', usurarioRouter.deletar)

export default router