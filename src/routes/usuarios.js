const express = require('express')
const router = express.Router()
const { Usuario } = require('../models')
//const { construirStringPerfisDeUsuario } = require('../utils/index')

router.get('/adicionar', async (req, res) => {
    return res.render('layouts/usuarios/usuarios-adicionar', { 
        nome: req.session.nome
    })
})

router.get('/listar', async (req, res) => {
    const usuarios = await Usuario.findAll()
    res.render('layouts/usuarios/usuarios-listar', { 
        usuarios: usuarios.map(usuario => {
            return {
                ...usuario.get(),
                perfis: usuario.perfis()
            }
        }),
        nome: req.session.nome
    })
})

module.exports = router