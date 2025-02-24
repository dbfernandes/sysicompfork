import * as path from 'path';
import * as uuid from 'uuid';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';

import { engine } from 'express-handlebars';

import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config({
  path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});

// To-Do: mover para um arquivo session.d.ts
declare module 'express-session' {
  export interface SessionData {
    tipoUsuario?:
      | {
          administrador: number;
          secretaria: number;
          coordenador: number;
          diretor: number;
          professor: number;
        }
      | undefined;
    uid: string;
    nome: string;
    editalPosition?: number; // Posição no formulário de inscrição de um candidato
  }
}

const app = express();

app.engine(
  'hbs',
  engine({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'views', 'partials'),
    helpers: require(path.join(__dirname, 'views', 'helpers', 'helpers')),
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

app.use(cookieParser());

app.use(
  session({
    genid: () => uuid.v4(), // usamos UUIDs para gerar os SESSID
    secret: 'eb9ac99d8a53fbfae6cae8e7a48c5b45',
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', parameterLimit: 50000, extended: true }),
);
// @ts-ignore
app.use(csrf({ cookie: true }));

app.use(
  '/script-adminlte',
  express.static(path.join(__dirname, '/../node_modules/admin-lte/')),
);

app.use('/public', express.static(path.join(__dirname, '/../public/')));
app.use('/img', express.static(path.join(__dirname, '/../public/img/')));

app.use(
  '/uploads',
  express.static(path.join(__dirname, '/../public/uploads/')),
);

// app.use(isUsuarioAutenticado);
// Colocar o logger depois
app.use(router);
app.use(errorHandler);

// app.use(isUsuarioAutenticado)

// app.use(resgistro)
// app.use(router)

export default app;
