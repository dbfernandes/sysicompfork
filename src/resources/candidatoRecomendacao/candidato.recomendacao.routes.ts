import express from 'express';
import candidatoRecomendacaoController from './candidato.recomendacao.controller';

const router = express.Router();

router.get('/', candidatoRecomendacaoController.begin);

router.put('/salvar/:token', candidatoRecomendacaoController.salvar);
router.put('/finalizar/:token', candidatoRecomendacaoController.finalizar);

export default router;
