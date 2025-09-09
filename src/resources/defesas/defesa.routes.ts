import express from 'express';
import defesaController from './defesa.controller';

const router = express.Router();

router.all('/adicionar', defesaController.criarDefesa);
router.post('/excluir/:id', defesaController.excluirDefesa);
router.get('/listar', defesaController.viewList);

// wizard qualificação
router.get('/editar/:id/qualificacao/step1', defesaController.viewQualiStep1);
router.post('/editar/:id/qualificacao/step1', defesaController.saveQualiStep1);
export default router;
