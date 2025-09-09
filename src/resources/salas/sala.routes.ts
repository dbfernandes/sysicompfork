import express from 'express';
import salasController from './sala.controller';

const router = express.Router();

router.all('/adicionar', salasController.criarSala);
router.get('/gerenciar', salasController.listarSalas);
router.get('/detalhes/:id', salasController.details);
router.post('/excluir/:id', salasController.excluirSala);
router.all('/editar/:id', salasController.editarSala);

export default router;
