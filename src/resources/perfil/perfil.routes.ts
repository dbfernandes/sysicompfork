import express from 'express';
import perfilController from './perfil.controller';
import { usuarioController } from '../usuarios/usuario.controller';
const router = express.Router();

router.get('/', perfilController.exibirDetalhes);
router.get('/editar/:id', usuarioController.editarUsuario);
router.post('/editar/:id', usuarioController.editarUsuario);
router.post('/deletar', perfilController.deletar);
router.post('/alterarSenha', perfilController.editarSenha);

export default router;
