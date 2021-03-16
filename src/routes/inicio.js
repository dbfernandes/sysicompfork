const express = require('express')
const router = express.Router()

router.get('/inicio', (req, res) => {
    res.render('layouts/inicio/inicio')
})

router.get('/', (req, res) => {
    res.redirect('/inicio')
})

module.exports = router