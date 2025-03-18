import express from 'express';
import afastamentoTemporarioController from './afastamento.temporario.controller';

const router = express.Router();

router.get('/criar', afastamentoTemporarioController.adicionarAfastamento);
router.post('/criar', afastamentoTemporarioController.adicionarAfastamento);
router.get('/listar', afastamentoTemporarioController.listarAfastamentos);
router.get('/dados/:id', afastamentoTemporarioController.exibirDetalhes);
router.post('/remover/:id', afastamentoTemporarioController.removerAfastamento);

export default router;
