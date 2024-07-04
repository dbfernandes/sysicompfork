import express from 'express';
import numerosIcompExceptionController from './numerosIcompException.controller';
import numerosICompInicioController from './numerosIcompInicio.controller';
import numerosICompProfessoresController from './numerosIcompProfessores.controller';
import numerosICompProjetosController from './numerosIcompProjetos.controller';
import numerosICompAlunosController from './numerosIcompAlunos.controller';
import numerosICompPublicacoesController from './numerosIcompPublicacoes.controller';
import { languageMiddleware } from '../../middlewares/languageMiddleware';

const router = express.Router();
router.use(languageMiddleware);

// Home
router.all('/', numerosICompInicioController);

// Lista de projetos atuais
router.all('/projetos', numerosICompProjetosController);

// Lista dos alunos egressos
router.all('/alunos/:curso', numerosICompAlunosController);
router.use('/alunos', numerosIcompExceptionController.redirectAlunos);

// Lista das publicações
router.all('/publicacoes', numerosICompPublicacoesController);
router.use(
  '/publicacoes/',
  numerosIcompExceptionController.redirectPublicacoes,
);

// Lista de docentes
router.all('/docentes', numerosICompProfessoresController.professores);

// Perfil
router.all('/docentes/:id', numerosICompProfessoresController.perfil);
router.all(
  '/docentes/:id/publicacoes',
  numerosICompProfessoresController.publicacoes,
);
router.all(
  '/docentes/:id/projetos',
  numerosICompProfessoresController.pesquisa,
);
router.all(
  '/docentes/:id/orientacoes/:tipo',
  numerosICompProfessoresController.orientacao,
);
router.all('/docentes/:id/premios', numerosICompProfessoresController.premios);
router.use('/docentes', numerosIcompExceptionController.redirectProfessores);

//* Rota Não Encontrada (404)
router.use(numerosIcompExceptionController.erro404);

export default router;
