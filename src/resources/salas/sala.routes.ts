import express from 'express';
import salasController from './sala.controller';

const router = express.Router();

router.all('/adicionar', salasController.criarSala);
router.post('/excluir/:id', salasController.excluirSala);
router.get('/gerenciar', salasController.listarSalas);
router.all('/editar/:id', salasController.editarSala);

export default router;
