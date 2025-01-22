import express from 'express';
import afastamentoTemporarioController from './afastamentoTemporario.controller';

const router = express.Router();

router.get('/criar', afastamentoTemporarioController.criar);
router.post('/criar', afastamentoTemporarioController.criar);
router.get('/listar', afastamentoTemporarioController.listar);
router.get('/dados/:id', afastamentoTemporarioController.detalhes);
router.post('/remover/:id', afastamentoTemporarioController.remover);

export default router;
