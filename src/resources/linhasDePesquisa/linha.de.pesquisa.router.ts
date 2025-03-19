import express from 'express';
import linhasDePesquisaController from './linha.de.pesquisa.controller';
import autenticacaoController from '../autenticacao/autenticacao.controller';
const router = express.Router();

// Rota para listar todas as linhas de pesquisa
router.get('/listar', linhasDePesquisaController.listar);

// Rota para detalhar uma linha de pesquisa
router.get('/detalhar/:id', linhasDePesquisaController.detalhar);

// Rotas para criar uma linha de pesquisa
router.get(
  '/criar',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.criar,
);
router.post(
  '/criar',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.criar,
);

// Rota para excluir uma linha de pesquisa
router.post(
  '/excluir/:id',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.excluir,
);

// Rotas para editar uma linha de pesquisa
router.get(
  '/editar/:id',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.editar,
);
router.post(
  '/editar/:id',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.editar,
);

export default router;
