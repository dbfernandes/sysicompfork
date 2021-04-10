const express = require('express')
const router = express.Router()
const { Usuario } = require('../models')
const { construirStringPerfisDeUsuario } = require('../utils/index')

router.get('/adicionar', async (req, res) => {
    res.render('layouts/usuarios/usuarios-adicionar')
})

router.get('/listar', async (req, res) => {
    const usuarios = await Usuario.findAll()
    res.render('layouts/usuarios/usuarios-listar', { 
        usuarios: usuarios.map(usuario => construirStringPerfisDeUsuario(usuario))
    })
})

module.exports = router