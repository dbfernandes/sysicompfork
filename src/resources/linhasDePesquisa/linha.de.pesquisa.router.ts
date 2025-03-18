import express from 'express';
import linhasDePesquisaController from './linha.de.pesquisa.controller';
import autenticacaoController from '../autenticacao/autenticacao.controller';
const router = express.Router();

router.get('/listar', linhasDePesquisaController.listar);
router.get('/busca/:id', linhasDePesquisaController.buscar);
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
router.post(
  '/remover/:id',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.remover,
);
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
