import express from 'express';
import linhasDePesquisaController from './linha.de.pesquisa.controller';
import autenticacaoController from '../autenticacao/autenticacao.controller';
const router = express.Router();

router.get('/listar', linhasDePesquisaController.listarPesquisas);
router.get('/busca/:id', linhasDePesquisaController.buscarPesquisa);
router.get(
  '/criar',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.criarPesquisa,
);
router.post(
  '/criar',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.criarPesquisa,
);
router.post(
  '/remover/:id',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.removerPesquisa,
);
router.get(
  '/editar/:id',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.editarPesquisa,
);
router.post(
  '/editar/:id',
  autenticacaoController.autorizarCoord,
  linhasDePesquisaController.editarPesquisa,
);

export default router;
