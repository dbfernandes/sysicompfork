const express = require('express')
const router = express.Router()

const inicioRoutes = require('./inicio')
router.use('/', inicioRoutes)

const usuariosRoutes = require('./usuarios')
router.use('/usuarios', usuariosRoutes)

module.exports = router