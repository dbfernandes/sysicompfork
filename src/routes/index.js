const express = require('express')
const router = express.Router()

const helloWorldRoutes = require('./home/home')

router.use('/home', helloWorldRoutes)

module.exports = router