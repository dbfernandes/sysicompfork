import express from 'express';
import inicioController from '../controllers/Inicio/inicio'
const router = express.Router()

router.get('/inicio',inicioController.adicionar)

router.get('/', inicioController.inicio)

export default router;