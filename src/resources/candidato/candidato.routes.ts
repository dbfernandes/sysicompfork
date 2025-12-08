import express from 'express';
import candidatoController from './candidato.controller';

const router = express.Router();

router.get('/search', candidatoController.search);

export default router;