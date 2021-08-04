const express = require('express')
const router = express.Router()

router.get('/adicionar', (req, res) => {
    return res.render('layouts/projetos/projetos-adicionar')
})

router.post('/adicionar', (req, res) => {
    console.log(req.body)
    return res.render('layouts/projetos/projetos-adicionar')
})

router.get('/listar', (req, res) => {
    return res.render('layouts/projetos/projetos-listar')
})

module.exports = router