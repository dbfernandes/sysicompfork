import express from 'express'
import exphbs from 'express-handlebars'
import session from 'express-session'
import router from './routes'
import dotenv from 'dotenv'
import * as uuid from 'uuid'
import cors from 'cors'
import * as path from 'path'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import logger from './utils/logger'

dotenv.config()
const app = express()
// `${__dirname}/views/partials/`
// `${__dirname}/views/helpers/helpers.js`
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: require(path.join(__dirname, 'views', 'helpers', 'helpers.js'))
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'))

app.use(cookieParser())

app.use(session({
  genid: (req) => {
    return uuid.v4() // usamos UUIDs para gerar os SESSID
  },
  secret: 'eb9ac99d8a53fbfae6cae8e7a48c5b45',
  resave: true,
  saveUninitialized: true
}))

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', parameterLimit: 50000 }))
// app.use(morgan('combined'))
app.use(csrf({ cookie: true }))

app.use(
  '/script-adminlte',
  express.static(path.join(__dirname, '/../node_modules/admin-lte/'))
)

app.use(
  '/public',
  express.static(path.join(__dirname, '/../public/'))
)

app.use(
  '/uploads',
  express.static(path.join(__dirname, '/../public/uploads/'))
)

app.use((req, res, next) => {
  if (req.session.uid) {
    logger.info(`SESSION ID: ${req.session.id}, USER ID:${req.session.uid}, URL: ${req.originalUrl}`)
  }
  next()
})
app.use('/', router)

export default app
