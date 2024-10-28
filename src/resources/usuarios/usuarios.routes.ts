import express from 'express';
import usuariosController from './usuarios.controller';

const router = express.Router();

router.get('/adicionar', usuariosController.adicionar);
router.post('/adicionar', usuariosController.adicionar);
router.get('/listar', usuariosController.listar);
router.post('/deletar/:id', usuariosController.deletar);
router.post('/restaurar/:id', usuariosController.restaurar);
router.get('/dados/:id', usuariosController.visualizar);
router.get('/editar/:id', usuariosController.editar);
router.post('/editar/:id', usuariosController.editar);
router.get('/verificarDiretorExistente', usuariosController.verificarDiretorExistente);

export default router;
