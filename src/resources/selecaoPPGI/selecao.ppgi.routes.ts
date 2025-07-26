import express, { NextFunction, Request, Response } from 'express';
import { languageMiddleware } from '@/middlewares/languageMiddlewarePPGI';
import {
  uploads,
  uploadsDados,
  uploadsProposta,
  uploadsPublicacoes,
} from '@/middlewares/multer.selecaoppgi.config';
import { isAuthSelecao } from '@/middlewares/usuarioAutenticacaoMiddleware';
import validate from '../../middlewares/validate';
import selecaoppgiController from './selecao.ppgi.controller';
import routerCandidatoRecomendacao from '../candidatoRecomendacao/candidato.recomendacao.routes';
import {
  changePasswordSchema,
  recoverPasswordSchema,
  signInSchema,
  signUpSchema,
} from '../candidato/candidato.schema';
import {
  validateCandidateEditInfo,
  validateCandidateGetInfo,
} from '@/middlewares/validateEditInfoCandidate';

const router = express.Router();

export const isAlredyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { session } = req;
  if (session.uid || session.tipoUsuario) return res.redirect('/formulario');
  next();
};

router.use(languageMiddleware);

//Rotas de recomendação
router.use('/recomendacoes', routerCandidatoRecomendacao);

router.get('/', isAlredyAuth, selecaoppgiController.inicio);

//Rotas de cadastro
router.get('/cadastro', isAlredyAuth, selecaoppgiController.signUp);
router.post('/cadastro', validate(signUpSchema), selecaoppgiController.signUp);

//Rotas de login
router.get('/entrar', isAlredyAuth, selecaoppgiController.signIn);
router.post('/entrar', validate(signInSchema), selecaoppgiController.signIn);

//Rotas de recuperação de senha
router.get(
  '/recuperarSenha',
  isAlredyAuth,
  selecaoppgiController.recuperarSenha,
);
router.post(
  '/recuperarSenha',
  validate(recoverPasswordSchema),
  selecaoppgiController.recuperarSenha,
);

//Rotas de troca de senha
router.get('/trocarSenha', isAlredyAuth, selecaoppgiController.trocarSenha);
router.put(
  '/trocarSenha',
  validate(changePasswordSchema),
  selecaoppgiController.trocarSenha,
);

///////////////////////////////////////////////
//Rotas que necessitam de autenticação
router.use(isAuthSelecao);

router.get(
  '/formulario',
  validateCandidateGetInfo,
  selecaoppgiController.renderForms,
);

router.put(
  '/formulario/1',
  validateCandidateEditInfo,
  uploadsDados,
  selecaoppgiController.formDados,
);
router.put(
  '/formulario/2',
  validateCandidateEditInfo,
  uploads,
  selecaoppgiController.formHistorico,
);
router.put(
  '/formulario/3',
  validateCandidateEditInfo,
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
  validateCandidateEditInfo,

  uploads,
  selecaoppgiController.uploadsPublicacoes,
);

router.delete(
  '/formulario/publicacoes',
  validateCandidateEditInfo,

  selecaoppgiController.deleteAllPublications,
);

router.get('/download/arquivo/:name', selecaoppgiController.downloadFile);

/////////
router.post('/logout', selecaoppgiController.logout);
router.post('/voltar', selecaoppgiController.voltarPassoForm);
router.post('/voltarInicio', selecaoppgiController.voltarInicio);

export default router;
