import express from 'express';
import usurarioRouter from './usuarios.controller';
const router = express.Router();

router.all('/adicionar', usurarioRouter.adicionar);
router.all('/listar', usurarioRouter.listar);
router.all('/deletar/:id', usurarioRouter.deletar);
router.all('/restaurar/:id', usurarioRouter.restaurar);
router.all('/dados/:id', usurarioRouter.visualizar);
router.all('/editar/:id', usurarioRouter.editar);

export default router;
