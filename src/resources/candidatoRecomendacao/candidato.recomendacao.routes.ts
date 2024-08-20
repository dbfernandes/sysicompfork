import express from 'express';
import candidatoRecomendacaoController from './candidato.recomendacao.controller';

const router = express.Router();

router.post('/adicionar', candidatoRecomendacaoController.adicionar);
router.get('/adicionar', candidatoRecomendacaoController.adicionar);

export default router;
