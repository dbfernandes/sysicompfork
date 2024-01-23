import express from 'express';
import numerosIcompExceptionController from '../controllers/numerosIcompExceptionController';
import numerosICompInicioController from '../controllers/numerosIcompInicioController'
import numerosICompProfessoresController from '../controllers/numerosIcompProfessoresController'
import numerosICompProjetosController from '../controllers/numerosIcompProjetosController'
import numerosICompAlunosController from '../controllers/numerosIcompAlunosController'
import numerosICompPublicacoesController from '../controllers/numerosIcompPublicacoesController'

const router = express.Router()

// Home
router.all('/', numerosICompInicioController);

// Lista de projetos atuais
router.all('/projetos', numerosICompProjetosController);

// Lista dos alunos egressos
router.all('/alunos/:curso', numerosICompAlunosController);
router.use('/alunos', numerosIcompExceptionController.redirectAlunos);

// Lista das publicações
router.all('/publicacoes', numerosICompPublicacoesController);
router.use('/publicacoes/', numerosIcompExceptionController.redirectPublicacoes);

// Lista de docentes
router.all('/docentes', numerosICompProfessoresController.professores);
router.use('/docentes', numerosIcompExceptionController.redirectProfessores);

// Perfil
router.all('/docente/:id', numerosICompProfessoresController.perfil);
router.all('/docente/:id/publicacoes', numerosICompProfessoresController.publicacoes);
router.all('/docente/:id/projetos', numerosICompProfessoresController.pesquisa);
router.all('/docente/:id/orientacoes/:tipo', numerosICompProfessoresController.orientacao);
router.all('/docente/:id/premios', numerosICompProfessoresController.premios);
router.use('/docente', numerosIcompExceptionController.redirectProfessores);

//* Rota Não Encontrada (404)
router.use(numerosIcompExceptionController.erro404);

export default router;