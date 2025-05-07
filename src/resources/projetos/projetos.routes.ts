import express from 'express';
import projetosController from './projetos.controller';

const router = express.Router();

router.get('/adicionar', projetosController.criarProjetos);
router.post('/adicionar', projetosController.criarProjetos);
router.get('/listar', projetosController.listarProjetos);

export default router;
