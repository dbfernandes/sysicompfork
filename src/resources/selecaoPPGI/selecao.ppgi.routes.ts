import express from 'express';
import { languageMiddleware } from '../../middlewares/languageMiddlewarePPGI';
import {
  uploads,
  uploadsDados,
  uploadsProposta,
  uploadsPublicacoes,
} from '../../middlewares/multer.selecaoppgi.config';
import { isAuthSelecao } from '../../middlewares/usuarioAutenticacaoMiddleware';
import validate from '../../middlewares/validate';
import selecaoppgiController from './selecao.ppgi.controller';
import routerCandidatoRecomendacao from '../candidatoRecomendacao/candidato.recomendacao.routes';
import {
  changePasswordSchema,
  recoverPasswordSchema,
  signInSchema,
  signUpSchema,
} from '../candidato/candidato.schema';
import { validateEditInfoCandidate } from '@/middlewares/validateEditInfoCandidate';

const router = express.Router();

router.use(languageMiddleware);

//Rotas de recomendação
router.use('/recomendacoes', routerCandidatoRecomendacao);

router.get('/', selecaoppgiController.inicio);

//Rotas de cadastro
router.get('/cadastro', selecaoppgiController.signUp);
router.post('/cadastro', validate(signUpSchema), selecaoppgiController.signUp);

//Rotas de login
router.get('/entrar', selecaoppgiController.signIn);
router.post('/entrar', validate(signInSchema), selecaoppgiController.signIn);

//Rotas de recuperação de senha
router.get('/recuperarSenha', selecaoppgiController.recuperarSenha);
router.post(
  '/recuperarSenha',
  validate(recoverPasswordSchema),
  selecaoppgiController.recuperarSenha,
);

//Rotas de troca de senha
router.get('/trocarSenha', selecaoppgiController.trocarSenha);
router.put(
  '/trocarSenha',
  validate(changePasswordSchema),
  selecaoppgiController.trocarSenha,
);

///////////////////////////////////////////////
//Rotas que necessitam de autenticação
router.use(isAuthSelecao);

router.get('/formulario', selecaoppgiController.renderForms);

router.put(
  '/formulario/1',
  validateEditInfoCandidate,
  uploadsDados,
  selecaoppgiController.formDados,
);
router.put(
  '/formulario/2',
  validateEditInfoCandidate,
  uploads,
  selecaoppgiController.formHistorico,
);
router.put(
  '/formulario/3',
  validateEditInfoCandidate,
  uploadsProposta,
  selecaoppgiController.formProposta,
);

router.get(
  '/formulario/publicacoes',
  uploadsPublicacoes,
  selecaoppgiController.uploadsPublicacoes,
);
router.post(
  '/formulario/publicacoes',
  uploads,
  selecaoppgiController.uploadsPublicacoes,
);

router.delete(
  '/formulario/publicacoes',
  selecaoppgiController.deleteAllPublications,
);

router.get('/download/arquivo/:name', selecaoppgiController.downloadFile);

/////////
router.post('/logout', selecaoppgiController.logout);
router.post('/voltar', selecaoppgiController.voltarPassoForm);
router.post('/voltarInicio', selecaoppgiController.voltarInicio);

export default router;
