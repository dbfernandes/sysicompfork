import express from 'express';
import selecaoppgiController from '../controllers/selecaoppgi';
const router = express.Router()

/* TODO - Add routes */
router.all('/', selecaoppgiController.begin);
router.all('/cadastro', selecaoppgiController.signin);
router.all('/entrar', selecaoppgiController.login)
router.all('/formulario', selecaoppgiController.forms)
router.all('/candidates', selecaoppgiController.candidates)

export default router;