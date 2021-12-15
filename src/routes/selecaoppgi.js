import express from 'express';
import selecaoppgiController from '../controllers/selecaoppgi';
const router = express.Router()

/* TODO - Add routes */
router.get('/', selecaoppgiController.begin);
router.get('/cadastro', selecaoppgiController.signin);
router.get('/entrar', selecaoppgiController.login)

export default router;