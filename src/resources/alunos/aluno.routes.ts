import express from 'express';
import alunosController from './aluno.controller';

const router = express.Router();

// Rota para gerenciar página principal de alunos
router.get('/', alunosController.exibirPaginaGerenciamento);

// Rota para importar lista de alunos
router.post('/importar', alunosController.importarListaAlunos);

export default router;
