import express from 'express';
import perfilController from './perfil.controller';
import { usuarioController } from '../usuarios/usuario.controller';
const router = express.Router();

router.get('/', perfilController.exibirDetalhes);
// router.get('/editar', perfilController.editar);
// router.post('/editar', perfilController.editar);
router.get('/editar/:id', usuarioController.editarUsuario);
router.post('/editar/:id', usuarioController.editarUsuario);
router.post('/deletar', perfilController.deletar);

export default router;
