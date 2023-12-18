import express from 'express';
import numerosIcompController from '../controllers/numerosIcompController';
const router = express.Router()

// Home
router.all('/', numerosIcompController.inicio);

// Lista de docentes
router.all('/docentes', numerosIcompController.professores);

// Perfil
router.all('/docente/:id', numerosIcompController.perfil);
router.all('/docente/:id/publicacoes', numerosIcompController.publicacoes);
router.all('/docente/:id/projetos', numerosIcompController.pesquisa);
router.all('/docente/:id/orientacoes/:tipo', numerosIcompController.orientacao);
router.all('/docente/:id/premios', numerosIcompController.premios);

// Alunos
router.all('/alunos/:curso', numerosIcompController.alunos);



export default router;