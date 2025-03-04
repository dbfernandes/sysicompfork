import express from 'express';
import candidatoRecomendacaoController from './candidato.recomendacao.controller';

const router = express.Router();

router.get('/', candidatoRecomendacaoController.begin);

router.patch('/:token', candidatoRecomendacaoController.salvar);
router.put('/:token', candidatoRecomendacaoController.finalizar);

export default router;
