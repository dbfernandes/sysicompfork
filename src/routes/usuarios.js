const express = require('express')
const router = express.Router()
const { Usuario } = require('../models')

router.get('/adicionar', async (req, res) => {
    res.render('layouts/usuarios/usuarios-adicionar')
})

router.get('/listar', async (req, res) => {
    console.log(await Usuario.findAll())
    res.render('layouts/usuarios/usuarios-listar')
})

module.exports = router