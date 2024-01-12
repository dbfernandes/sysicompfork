import express from 'express';
import numerosIcompController from '../controllers/numerosIcompController';
const router = express.Router()

// Home
router.all('/', numerosIcompController.inicio);

// Lista de docentes
router.all('/docentes', numerosIcompController.professores);

// Lista de projetos atuais
router.all('/projetos', numerosIcompController.projetos);

// Lista dos alunos egressos
router.all('/alunos/:curso', numerosIcompController.alunos);

// Lista das publicações recentes
router.all('/publicacoes', numerosIcompController.publicacaoList);

// Perfil
router.all('/docente/:id', numerosIcompController.perfil);
router.all('/docente/:id/publicacoes', numerosIcompController.publicacoes);
router.all('/docente/:id/projetos', numerosIcompController.pesquisa);
router.all('/docente/:id/orientacoes/:tipo', numerosIcompController.orientacao);
router.all('/docente/:id/premios', numerosIcompController.premios);




export default router;