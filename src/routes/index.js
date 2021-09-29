const express = require('express')
const inicioRoutes = require('./inicio')
const autenticacaoRoutes = require('./autenticacao')
const usuariosRoutes = require('./usuarios')
import projetosRoutes from './projetos'
//const { isUsuarioAutenticado } = require('../utils/autenticacao-middleware')

const router = express.Router()

//router.use('/', isUsuarioAutenticado)
router.use('/', inicioRoutes)
router.use('/', autenticacaoRoutes)
router.use('/usuarios', usuariosRoutes)
router.use('/projetos', projetosRoutes)

module.exports = router