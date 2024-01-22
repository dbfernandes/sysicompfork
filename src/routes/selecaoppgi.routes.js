import express from 'express';
import selecaoppgiController from '../controllers/selecaoppgiController';
const router = express.Router()

/* TODO - Add routes */
router.all('/', selecaoppgiController.begin);
router.all('/cadastro', selecaoppgiController.signin);
router.all('/entrar', selecaoppgiController.login)
router.all('/formulario/1' ,selecaoppgiController.form1)
router.all('/formulario/2' ,selecaoppgiController.form2)
router.all('/formulario', selecaoppgiController.forms)
router.all('/candidates', selecaoppgiController.candidates)
router.all('/voltar', selecaoppgiController.voltar)
export default router;