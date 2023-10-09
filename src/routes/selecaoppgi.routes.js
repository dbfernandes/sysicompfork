import express from 'express';
import selecaoppgiController from '../controllers/selecaoppgiController';
const router = express.Router()

/* TODO - Add routes */
router.all('/', selecaoppgiController.begin);
router.all('/cadastro', selecaoppgiController.signin);
router.all('/entrar', selecaoppgiController.login)
router.all('/formulario', selecaoppgiController.forms)
router.all('/formulario/1' ,selecaoppgiController.form1)
router.all('/candidates', selecaoppgiController.candidates)

export default router;