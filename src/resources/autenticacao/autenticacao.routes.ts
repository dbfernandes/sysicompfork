import express from 'express';
import autenticacaoController from './autenticacao.controller';

const router = express.Router();

router.get('/login', autenticacaoController.login);
router.get('/logout', autenticacaoController.logout);
router.get('/recuperar-senha', autenticacaoController.recuperarSenha);
router.post('/login', autenticacaoController.login);
router.post('/recuperar-senha', autenticacaoController.recuperarSenha);
router.post('/login', autenticacaoController.login);
router.get('/recuperarSenha', autenticacaoController.recuperarSenha);
router.post('/recuperarSenha', autenticacaoController.recuperarSenha);
router.get('/alterarSenha', autenticacaoController.trocaSenha);
router.put('/alterarSenha', autenticacaoController.trocaSenha);
router.get('/logout', autenticacaoController.logout);

export default router;
