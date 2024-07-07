import express from 'express';
import autenticacaoController from './autenticacao.controller';

const router = express.Router();

router.get('/login', autenticacaoController.login);
router.get('/logout', autenticacaoController.logout);
router.get('/recuperar-senha', autenticacaoController.recuperarSenha);
router.post('/login', autenticacaoController.login);
router.post('/recuperar-senha', autenticacaoController.recuperarSenha);

export default router;
