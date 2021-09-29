const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const router = require('./routes/index')

require("dotenv").config()  

const uuid = require('uuid')
const app = express()

const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.engine('hbs', exphbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    partialsDir: `${__dirname}/views/partials/`,
    helpers: require(`${__dirname}/views/helpers/helpers.js`)
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));

app.use(session({
    genid: (req) => {
        return uuid.v4() // usamos UUIDs para gerar os SESSID
    },
    secret: "eb9ac99d8a53fbfae6cae8e7a48c5b45",
    resave: true,
    saveUninitialized: true,
    cookie: { expires: 60 * 60, httpOnly: true }
}));

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))

app.use(
    '/script-adminlte',
    express.static(path.join(__dirname, '/../node_modules/admin-lte/'))
);

app.use(
    '/public',
    express.static(path.join(__dirname, '/public/'))
);

app.use('/', router)

export default app