import express from 'express';
import afastamentoTemporarioController from './afastamentoTemporario.controller';

const router = express.Router();

router.get('/criar', afastamentoTemporarioController.adicionarAfastamento);
router.post('/criar', afastamentoTemporarioController.adicionarAfastamento);
router.get('/listar', afastamentoTemporarioController.listarAfastamentos);
router.get('/dados/:id', afastamentoTemporarioController.exibirDetalhes);
router.post('/remover/:id', afastamentoTemporarioController.remover);

export default router;
