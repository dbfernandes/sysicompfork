import express from 'express';
import numerosRouter from '../resources/numerosIcomp/numerosIcomp.routes';

const router = express.Router();

router.get('/changeLanguage/:lang', (req, res) => {
  const supportedLanguages = ['en', 'ptBR']; // Exemplo de idiomas suportados
  const lang = req.params.lang;
  if (supportedLanguages.includes(lang)) {
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: true });
  }

  const referer = req.get('referer') || '/'; // Fallback para a home
  res.redirect(referer);
});

// ROTAS DE OUTROS PROJETOS
router.use('/', numerosRouter);

export default router;
