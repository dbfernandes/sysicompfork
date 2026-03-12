import * as path from 'path';

import helpers from '@/views/helpers/helpers';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { engine } from 'express-handlebars';

import morgan from 'morgan';
import logger from '@utils/logger';
import { logRequestResponse } from '@utils/loggerResponse';
import { STATIC_SKIP } from '@utils/constantes';
import { errorHandler } from '@/middlewares/errorHandler';
import router from '@/routes/routesNumerosIcomp';
import { createSeoRoutes } from '@resources/numerosIcomp/seo';
import docenteService from '@resources/docente/docente.service';

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const app = express();

app.engine(
  'hbs',
  engine({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: path.join(__dirname, '..', 'views', 'partials'),
    helpers: helpers,
  }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '..', '/views'));
app.set('trust proxy', 1);

app.use(cookieParser());

app.use(cors());
app.use(express.json({ limit: '70mb' }));
app.use(
  express.urlencoded({ limit: '70mb', parameterLimit: 50000, extended: true }),
);

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
    skip: (req, _) => {
      // ignora qualquer rota que comece com /script-adminlte
      return STATIC_SKIP.test(req.path) || req.path === '/favicon.ico';
    },
  }),
);
app.use(logRequestResponse);

app.use((req, res, next) => {
  res.locals.basePath = req.baseUrl || ''; // Se usar Router
  next();
});
app.use(
  createSeoRoutes({
    professorService: {
      listarPublicos: docenteService.listarPublicos,
    },
  }),
);
app.use(router);
app.use(errorHandler);

export default app;
