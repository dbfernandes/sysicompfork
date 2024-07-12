import { Request, Response, NextFunction } from 'express';
import language from '../utils/i18n';

export const languageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { lng } = req.query;
  const availableLng = language.i18next.languages;
  const defaultLng = language.defaultLng;
  if (typeof lng === 'string' && availableLng.includes(lng)) {
    language.i18next.changeLanguage(lng);
  } else {
    req.query.lng = defaultLng;
    language.i18next.changeLanguage(defaultLng);
  }
  next();
};
