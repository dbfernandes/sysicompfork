import express from 'express';
import projetosController from './projetos.controller';

const router = express.Router();

router.get('/adicionar', projetosController.adicionar);
router.post('/adicionar', projetosController.adicionar);
router.get('/listar', projetosController.listar);

export default router;
