import express from 'express';
import inscricaoController from '../controllers/inscricao';
const router = express.Router()

/* TODO - Add routes */
router.get('/', inscricaoController.begin);

export default router;