import express from 'express';
import inicioController from '../controllers/inicio'
const router = express.Router()

router.get('/inicio',inicioController.adicionar)

router.get('/', inicioController.inicio)

export default router;