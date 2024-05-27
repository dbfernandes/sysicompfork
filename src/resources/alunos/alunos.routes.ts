import express from 'express'
import alunosController from './alunos.controller'

const router = express.Router()

router.all('/', alunosController.inicio)

router.all('/upload', alunosController.carregar)

export default router
