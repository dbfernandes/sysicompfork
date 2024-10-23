import { Request, Response, NextFunction } from 'express';
import language from '../utils/i18n';

export function languageMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const lang = req.cookies.lang || 'ptBR'; // Verifica se o cookie "lang" existe, senão usa 'en'
  // req.language = lang; // Armazena o idioma na requisição
  // res.locals.language = lang; // armazena o idioma na variável local

  language.i18next.changeLanguage(lang);
  next();
}
