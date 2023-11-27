import express from 'express';
import numerosIcompController from '../controllers/numerosIcompController';
const router = express.Router()

/* TODO - Add routes */
router.all('/', numerosIcompController.inicio);
router.all('/docentes', numerosIcompController.professores);
router.all('/perfil/:id', numerosIcompController.perfil);

export default router;