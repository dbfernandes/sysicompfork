import express from 'express';
import afastamentoTemporarioController from '../controllers/afastamentoTemporarioController';

const router = express.Router();

router.get('/criar', afastamentoTemporarioController.criar);
router.post('/criar', afastamentoTemporarioController.criar);
router.get('/listar', afastamentoTemporarioController.listar);
router.get('/dados/:id', afastamentoTemporarioController.vizualizar);
router.post('/remover/:id', afastamentoTemporarioController.remover);

export default router;
