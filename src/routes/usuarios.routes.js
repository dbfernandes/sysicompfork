import express from 'express'
import usurarioRouter from '../controllers/usuariosController'
const router = express.Router()
const { Usuario } = require('../models')

router.get('/adicionar', usurarioRouter.adicionar)

router.get('/listar', usurarioRouter.listar) 

export default router