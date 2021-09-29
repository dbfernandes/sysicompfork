const express = require('express')
const router = express.Router()

router.get('/inicio', async (req, res) => {
    return res.render('inicio/inicio', { 
        nome: req.session.nome
    })
})

router.get('/', async (req, res) => {
    return res.redirect('/inicio')
})

module.exports = router