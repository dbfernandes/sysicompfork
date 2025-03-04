import express from 'express';
import autenticacaoController from './autenticacao.controller';

const router = express.Router();

router.get('/login', autenticacaoController.login);
router.post('/login', autenticacaoController.login);

router.get('/logout', autenticacaoController.logout);

router.get('/recuperarSenha', autenticacaoController.recuperarSenha);
router.post('/recuperarSenha', autenticacaoController.recuperarSenha);

router.get('/alterarSenha', autenticacaoController.trocaSenha);
router.put('/alterarSenha', autenticacaoController.trocaSenha);

export default router;
