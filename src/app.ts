/* app.ts — CommonJS-friendly (TypeScript) */
import csurf from 'csurf'; // com “s” no final
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import helpers from './views/helpers/helpers'; // se o export for `export default`

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';

import router from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

import morgan from 'morgan';
import logger from './utils/logger';

/* ───────── env ───────── */
dotenv.config({
  // __dirname já existe em CJS; não precisamos de import.meta
  path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});

/* ───────── helpers (require síncrono) ───────── */

/* ───────── Express + Handlebars ───────── */
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
app.set('views', path.join(__dirname, 'views'));

/* ───────── middlewares ───────── */
app.use(cookieParser());

app.use(
  session({
    genid: () => uuidv4(), // CORRIGIDO (wrapper)
    secret: process.env.SESSION_SECRET ?? 'dev-secret',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', parameterLimit: 50000, extended: true }),
);
// @ts-ignore
app.use(csurf());

app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }),
);

/* ───────── assets estáticos ───────── */
app.use(
  '/script-adminlte',
  express.static(path.resolve(process.cwd(), 'node_modules/admin-lte')),
);
app.use('/public', express.static(path.resolve(process.cwd(), 'public')));
app.use('/img', express.static(path.resolve(process.cwd(), 'public/img')));

/* ───────── rotas / erros ───────── */
app.use(router);
app.use(errorHandler);

export default app;
