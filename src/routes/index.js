/* Import routes */
import express from 'express'
import inicioRoutes from './inicio'
import autenticacaoRoutes from './autenticacao'
import usuariosRoutes from './usuarios'
import projetosRoutes from './projetos'
import editalRouter from './edital.routes'
import selecaoppgiRouter from './selecaoppgi';

const router = express.Router()

//const { isUsuarioAutenticado } = require('../utils/autenticacao-middleware')

/* Add routes */
//router.use('/', isUsuarioAutenticado)
// router.use('/', autenticacaoRoutes)
//router.use('/inscricao', inscricaoRouter);



router.use('/', inicioRoutes)
router.use('/', autenticacaoRoutes)
router.use('/usuarios', usuariosRoutes)
router.use('/projetos', projetosRoutes)
router.use('/selecaoppgi', selecaoppgiRouter);
router.use('/edital', editalRouter)


export default router





