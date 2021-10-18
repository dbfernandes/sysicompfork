import express from 'express'
import inicioRoutes from './inicio'
import autenticacaoRoutes from './autenticacao'
import usuariosRoutes from './usuarios'
import projetosRoutes from './projetos'
//const { isUsuarioAutenticado } = require('../utils/autenticacao-middleware')

const router = express.Router()

//router.use('/', isUsuarioAutenticado)
router.use('/', inicioRoutes)
router.use('/', autenticacaoRoutes)
router.use('/usuarios', usuariosRoutes)
router.use('/projetos', projetosRoutes)

module.exports = router