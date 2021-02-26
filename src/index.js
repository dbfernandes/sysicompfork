const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'));

const router = require('./routes/index')
app.use('/', router)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))

module.exports = app