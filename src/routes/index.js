const express = require('express')
const router = express.Router()

const homeRoutes = require('./home')
router.use('/home', homeRoutes)

const usuariosRoutes = require('./usuarios')
router.use('/usuarios', usuariosRoutes)

module.exports = router