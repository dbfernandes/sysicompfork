import express from 'express';
import perfilController from './perfil.controller';

const router = express.Router();

router.get('/', perfilController.visualizar);
router.get('/editar', perfilController.editar);
router.post('/editar', perfilController.editar);
router.post('/deletar', perfilController.deletar);

export default router;
