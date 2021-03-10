const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('layouts/home/home')
})

module.exports = router