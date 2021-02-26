const express = require('express')
const router = express.Router()

const helloWorldRoutes = require('./hello-world/hello-world')

router.use('/hello-world', helloWorldRoutes)

module.exports = router