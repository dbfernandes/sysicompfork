import express from 'express';
import { usuarioController } from './usuario.controller';
const router = express.Router();

router.get('/adicionar', usuarioController.adicionarUsuario);
router.post('/adicionar', usuarioController.adicionarUsuario);
router.get('/listar', usuarioController.listarUsuario);
router.post('/bloquear/:id', usuarioController.bloquearUsuario);
router.post('/restaurar/:id', usuarioController.restaurarUsuario);
router.get('/dados/:id', usuarioController.exibirDetalhesUsuario);
router.get('/editar/:id', usuarioController.editarUsuario);
router.post('/editar/:id', usuarioController.editarUsuario);
router.get(
  '/verificarDiretor',
  usuarioController.verificarUsuarioDiretor,
);

export default router;
