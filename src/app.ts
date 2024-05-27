import express from 'express'
import { engine } from 'express-handlebars'
import session from 'express-session'
import router from './routes'
import dotenv from 'dotenv'
import * as uuid from 'uuid'
import cors from 'cors'
import * as path from 'path'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import { isUsuarioAutenticado } from './middlewares/usuarioAutenticacaoMiddleware'

dotenv.config()
const app = express()
// `${__dirname}/views/partials/`
// `${__dirname}/views/helpers/helpers.js`
app.engine('hbs', engine({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: require(path.join(__dirname, 'views', 'helpers', 'helpers.js'))
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'))

// To-Do: mover para um arquivo session.d.ts
declare module 'express-session' {
  export interface SessionData {
    tipoUsuario?: {
      administrador: number
      secretaria: number,
      coordenador: number
      professor: number
    } | undefined,
    uid: string,
    nome: string
  }
}


app.use(cookieParser())

app.use(session({
  genid: () => {
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

app.use(isUsuarioAutenticado)
// Colocar o logger depois
app.use(router)

export default app
