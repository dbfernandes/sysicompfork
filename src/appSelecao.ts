import * as path from 'path';
import * as uuid from 'uuid';

import helpers from './views/helpers/helpers'; // se o export for `export default`

import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';

import { engine } from 'express-handlebars';

import router from './routes/routesSelecao';
import { errorHandler } from './middlewares/errorHandler';
import morgan from 'morgan';
import logger from '@utils/logger';

import redisClient from './redisClient';
import { RedisStore } from 'connect-redis'; // ✅ Correto na v6+

dotenv.config({
  path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});

const isProduction = process.env.NODE_ENV === 'production';
const keySession = process.env.SESSION_SECRET || 'ufam98';

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
    helpers: helpers,
  }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

app.use(cookieParser());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: keySession,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 48 * 60 * 60 * 1000, // 2 horas
      httpOnly: true,
      secure: isProduction, // true se usar HTTPS
    },
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
  express.static(path.resolve(process.cwd(), 'node_modules/admin-lte')),
);
app.use('/public', express.static(path.resolve(process.cwd(), 'public')));
app.use('/img', express.static(path.resolve(process.cwd(), 'public/img')));
// Colocar o logger depois
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }),
);

app.use((req, res, next) => {
  res.locals.basePath = req.baseUrl || ''; // Se usar Router
  next();
});
app.use(router);
app.use(errorHandler);

export default app;
