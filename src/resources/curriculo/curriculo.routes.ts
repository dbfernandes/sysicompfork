// src/routes/curriculo.routes.ts
import express from 'express';
import curriculoController from './curriculo.controller';

const router = express.Router();

router.get('/', curriculoController.visualizarCurriculo);
router.get('/numeros', curriculoController.viewData);
router.get('/numeros/export-xlsx', curriculoController.geraPlanilha);

router.get('/avatar/:id', curriculoController.verificarAvatar);
router.post('/upload', curriculoController.carregar);

// ✅ nova rota para reprocessar todos os XMLs
router.get('/reprocessar-lattes', curriculoController.reprocessarTodos);

export default router;
