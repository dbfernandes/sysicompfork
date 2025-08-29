/* app.ts — CommonJS-friendly (TypeScript) */
import path from 'node:path';
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

import redisClient from './redisClient';
import { RedisStore } from 'connect-redis';
import { logRequestResponse } from '@utils/loggerResponse';
import { STATIC_SKIP } from '@utils/constantes'; // ✅ Correto na v6+
/* ───────── env ───────── */
dotenv.config({
  // __dirname já existe em CJS; não precisamos de import.meta
  path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});

const isProduction = process.env.NODE_ENV === 'production';
const keySession = process.env.SESSION_SECRET || 'ufam98';
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
app.set('trust proxy', 1);

/* ───────── middlewares ───────── */
app.use(cookieParser());

app.use(
  session({
    name: 'sysicomp_sessao', // 👈 nome diferente por app
    store: new RedisStore({
      client: redisClient,
      prefix: 'sysicomp_sessao:', // prefixo diferente no Redis
      ttl: 60 * 60 * 24 * 7, // 48h
    }),
    secret: keySession,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 2 horas
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
// cria token para body
morgan.token('body', (req: any) => {
  if (req.body && Object.keys(req.body).length > 0) {
    return JSON.stringify(req.body);
  }
  return '';
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body',
    {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
      skip: (req, _) => {
        return STATIC_SKIP.test(req.originalUrl) || req.path === '/favicon.ico';
      },
    },
  ),
);
app.use(logRequestResponse);

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
