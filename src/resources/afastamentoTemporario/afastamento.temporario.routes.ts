import express from 'express';
import afastamentoTemporarioController from './afastamento.temporario.controller';
import { criarAfastamentoPDF } from '@utils/criarAfastamentoPDF';

const router = express.Router();

router.get('/criar', afastamentoTemporarioController.adicionarAfastamento);
router.post('/criar', afastamentoTemporarioController.adicionarAfastamento);
router.get('/listar', afastamentoTemporarioController.listarAfastamentos);
router.get('/dados/:id', afastamentoTemporarioController.exibirDetalhes);
router.post('/remover/:id', afastamentoTemporarioController.removerAfastamento);
router.use('/gerarPDF/:id', criarAfastamentoPDF);

export default router;
