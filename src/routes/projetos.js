const express = require('express')
const router = express.Router()

router.get('/adicionar', (req, res) => {
    return res.render('layouts/projetos/projetos-adicionar', { 
        nome: req.session.nome
    })
})

router.post('/adicionar', (req, res) => {
    return res.render('layouts/projetos/projetos-adicionar', { 
        nome: req.session.nome
    })
})

router.get('/listar', (req, res) => {
    return res.render('layouts/projetos/projetos-listar', { 
        nome: req.session.nome
    })
})

module.exports = router