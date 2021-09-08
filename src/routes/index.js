const express = require('express')
const router = express.Router()
const { isUsuarioAutenticado } = require('../utils/autenticacao-middleware')

router.use('/', isUsuarioAutenticado)

const inicioRoutes = require('./inicio')
router.use('/', inicioRoutes)

const autenticacaoRoutes = require('./autenticacao')
router.use('/', autenticacaoRoutes)

const usuariosRoutes = require('./usuarios')
router.use('/usuarios', usuariosRoutes)

const projetosRoutes = require('./projetos')
router.use('/projetos', projetosRoutes)

module.exports = router