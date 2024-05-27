import express from 'express'
import inicioController from './inicio.controller'
const router = express.Router()

// router.get('/inicio',inicioController.adicionar)

router.use('/', inicioController.inicio)

export default router
