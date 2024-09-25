import express from 'express';
import {
  uploads,
  uploadsProposta,
  uploadsPublicacoes,
} from '../../middlewares/multer.selecaoppgi.config';
import { isAuthSelecao } from '../../middlewares/usuarioAutenticacaoMiddleware';
import selecaoppgiController from './selecaoppgi.controller';
import language from '../../utils/i18n';
import routerCandidatoRecomendacao from '../candidatoRecomendacao/candidato.recomendacao.routes';

const router = express.Router();

const languageMiddleware = (req, res, next) => {
  const lang = req.cookies.lang || 'ptBR'; // Verifica se o cookie "lang" existe, senão usa 'en'
  req.language = lang; // Armazena o idioma na requisição
  res.locals.language = lang; // armazena o idioma na variável local

  language.i18next.changeLanguage(lang); // Altera o idioma no i18next
  next(); // Continua para a próxima middleware/rota
};

router.use(languageMiddleware);

router.use('/recomendacoes', routerCandidatoRecomendacao);

router.get('/', selecaoppgiController.begin);

router.get('/cadastro', selecaoppgiController.signUp);
router.post('/cadastro', selecaoppgiController.signUp);

router.get('/entrar', selecaoppgiController.login);
router.post('/entrar', selecaoppgiController.login);

router.get('/recuperarSenha', selecaoppgiController.recuperarSenha);
router.post('/recuperarSenha', selecaoppgiController.recuperarSenha);

router.get('/trocarSenha', selecaoppgiController.trocarSenha);
router.put('/trocarSenha', selecaoppgiController.trocarSenha);

router.use(isAuthSelecao);

router.get('/formulario', selecaoppgiController.forms);

router.put('/formulario/1', selecaoppgiController.form1);
router.put('/formulario/2', uploads, selecaoppgiController.form2);
router.put(
  '/formulario/3',
  uploadsProposta,
  selecaoppgiController.formProposta,
);

router.get(
  '/formulario/publicacoes',
  uploadsPublicacoes,
  selecaoppgiController.formPublicacoes,
);
router.post(
  '/formulario/publicacoes',
  uploads,
  selecaoppgiController.formPublicacoes,
);

router.get('/candidates', selecaoppgiController.candidates);

router.get('/download/arquivo/:name', selecaoppgiController.downloadFile);

/////////
router.post('/logout', selecaoppgiController.logout);
router.post('/voltar', selecaoppgiController.backStep);
router.post('/voltarInicio', selecaoppgiController.backToStart);

export default router;
