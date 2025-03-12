import express from 'express';
import { usuarioController } from './usuario.controller';
const router = express.Router();

router.get('/adicionar', usuarioController.adicionar);
router.post('/adicionar', usuarioController.adicionar);
router.get('/listar', usuarioController.listar);
router.post('/bloquear/:id', usuarioController.bloquear);
router.post('/restaurar/:id', usuarioController.restaurar);
router.get('/dados/:id', usuarioController.exibirDetalhes);
router.get('/editar/:id', usuarioController.editar);
router.post('/editar/:id', usuarioController.editar);
router.get(
  '/verificarDiretor',
  usuarioController.verificarDiretor,
);

export default router;
