import express from 'express';
import horasComplementares from './horas.complementares.controller';
const router = express.Router();

router.get('/listar', horasComplementares.listarHoras);
router.get('/adicionar', horasComplementares.adicionarAtividade);

export default router;
