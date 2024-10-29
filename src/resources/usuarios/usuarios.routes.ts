import express from 'express';
import usuariosController from './usuarios.controller';
import autenticacaoController from '../autenticacao/autenticacao.controller';

const router = express.Router();

router.get('/listar', usuariosController.listar);
router.get('/adicionar', autenticacaoController.autorizarAdmin, usuariosController.adicionar);
router.post('/adicionar', autenticacaoController.autorizarAdmin, usuariosController.adicionar);
router.post('/deletar/:id', autenticacaoController.autorizarAdmin, usuariosController.deletar);
router.post('/restaurar/:id', autenticacaoController.autorizarAdmin, usuariosController.restaurar);
router.get('/dados/:id', autenticacaoController.autorizarAdmin, usuariosController.visualizar);
router.get('/editar/:id', autenticacaoController.autorizarAdmin, usuariosController.editar);
router.post('/editar/:id', autenticacaoController.autorizarAdmin, usuariosController.editar);
router.get('/verificarDiretorExistente', autenticacaoController.autorizarAdmin, usuariosController.verificarDiretorExistente);

export default router;
