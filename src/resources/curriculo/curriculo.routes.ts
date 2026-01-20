// src/routes/curriculo.routes.ts
import express from 'express';
import curriculoController from './curriculo.controller';

const router = express.Router();

router.get('/', curriculoController.visualizarCurriculo);
router.get('/numeros', curriculoController.viewData);

router.get('/avatar/:id', curriculoController.verificarAvatar);
router.post('/upload', curriculoController.carregar);

export default router;
