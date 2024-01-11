import express from 'express'
import alunosController from '../controllers/alunosController'

const router = express.Router()

router.get('/', alunosController.inicio)


router.post('/upload', alunosController.carregar)


export default router