/* Import routes */
import express from 'express'
import inicioRoutes from './inicio.routes'
import autenticacaoRoutes from './autenticacao.routes'
import usuariosRoutes from './usuarios.routes'
import projetosRoutes from './projetos.routes'
import selecaoppgiRoutes from './selecaoppgi.routes'

const router = express.Router()

//const { isUsuarioAutenticado } = require('../utils/autenticacao-middleware')
import selecaoppgiRouter from './selecaoppgi';


/* Add routes */
//router.use('/', isUsuarioAutenticado)

// router.use('/', autenticacaoRoutes)
//router.use('/inscricao', inscricaoRouter);

router.use('/', inicioRoutes)
router.use('/usuarios', usuariosRoutes)
router.use('/projetos', projetosRoutes)
router.use('/selecaoppgi', selecaoppgiRoutes)


export default router