import express from 'express';
import selecaoppgiController from '../controllers/selecaoppgi';
const router = express.Router()

/* TODO - Add routes */
router.get('/', selecaoppgiController.begin);
router.get('/cadastro', selecaoppgiController.signin);
router.post('/cadastro', selecaoppgiController.signin);
router.get('/entrar', selecaoppgiController.login)
router.get('/formulario', selecaoppgiController.forms)
router.get('/candidates', selecaoppgiController.candidates)

export default router;