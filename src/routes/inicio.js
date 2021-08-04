const express = require('express')
const router = express.Router()

router.get('/inicio', (req, res) => {
    return res.render('layouts/inicio/inicio')
})

router.get('/', (req, res) => {
    return res.redirect('/inicio')
})

module.exports = router