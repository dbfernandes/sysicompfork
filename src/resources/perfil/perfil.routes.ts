import express from 'express';
import perfilController from './perfil.controller';
import usuariosController from '../usuarios/usuarios.controller';

const router = express.Router();

router.get('/', perfilController.visualizar);
// router.get('/editar', perfilController.editar);
// router.post('/editar', perfilController.editar);
router.get('/editar/:id', usuariosController.editar);
router.post('/editar/:id', usuariosController.editar);
router.post('/deletar', perfilController.deletar);

export default router;
