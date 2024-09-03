import express from 'express';
import {
  uploads,
  uploadsProposta,
  uploadsPublicacoes,
} from '../../middlewares/multer.selecaoppgi.config';
import { isAuthSelecao } from '../../middlewares/usuarioAutenticacaoMiddleware';

import selecaoppgiController from './selecaoppgi.controller';

import { criarPDF } from '../../utils/teste';
import routerCandidatoRecomendacao from '../candidatoRecomendacao/candidato.recomendacao.routes';

const router = express.Router();
router.use('/recomendacoes', routerCandidatoRecomendacao);

router.get('/', selecaoppgiController.begin);

router.get('/cadastro', selecaoppgiController.signUp);
router.post('/cadastro', selecaoppgiController.signUp);

router.get('/entrar', criarPDF, selecaoppgiController.login);
router.post('/entrar', criarPDF, selecaoppgiController.login);

router.get('/recuperarSenha', selecaoppgiController.recuperarSenha);
router.post('/recuperarSenha', selecaoppgiController.recuperarSenha);

router.get('/trocarSenha', selecaoppgiController.trocarSenha);
router.put('/trocarSenha', selecaoppgiController.trocarSenha);

router.use(isAuthSelecao);

router.get('/formulario', selecaoppgiController.forms);

router.put('/formulario/1', criarPDF, selecaoppgiController.form1);
router.put('/formulario/2', uploads, selecaoppgiController.form2);
router.put(
  '/formulario/3',
  uploadsProposta,
  selecaoppgiController.formProposta,
);

router.get(
  '/formulario/publicacoes',
  uploadsPublicacoes,
  selecaoppgiController.formPublicacoes,
);
router.post(
  '/formulario/publicacoes',
  uploads,
  selecaoppgiController.formPublicacoes,
);

router.get('/candidates', selecaoppgiController.candidates);

router.get('/download/arquivo/:name', selecaoppgiController.downloadFile);

/////////
router.post('/logout', selecaoppgiController.logout);
router.post('/voltar', selecaoppgiController.backStep);
router.post('/voltarInicio', selecaoppgiController.backToStart);

export default router;
