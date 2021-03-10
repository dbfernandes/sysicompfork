const express = require('express')
const router = express.Router()

router.get('/adicionar', (req, res) => {
    res.render('layouts/usuarios/usuarios-adicionar')
})

router.get('/listar', (req, res) => {
    res.render('layouts/usuarios/usuarios-listar')
})

module.exports = router