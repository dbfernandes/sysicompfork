/* Import routes */
import express from 'express'
import inicioRoutes from './inicio'
import autenticacaoRoutes from './autenticacao'
import usuariosRoutes from './usuarios'
import projetosRoutes from './projetos'
//const { isUsuarioAutenticado } = require('../utils/autenticacao-middleware')
<<<<<<< HEAD
//import inscricaoRouter from './inscricao';
=======
import selecaoppgiRouter from './selecaoppgi';
>>>>>>> 6cbd1211935a1e442448739e94833fb0e21d3458

const router = express.Router()

/* Add routes */
//router.use('/', isUsuarioAutenticado)
router.use('/', inicioRoutes)
router.use('/', autenticacaoRoutes)
router.use('/usuarios', usuariosRoutes)
router.use('/projetos', projetosRoutes)
<<<<<<< HEAD
//router.use('/inscricao', inscricaoRouter);
=======
router.use('/selecaoppgi', selecaoppgiRouter);
>>>>>>> 6cbd1211935a1e442448739e94833fb0e21d3458

export default router