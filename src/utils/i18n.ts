import i18next from 'i18next';
import * as HandlebarsI18n from 'handlebars-i18n';

import enTranslation from '../locale/en';
import ptBrTranslation from '../locale/ptBR';

const defaultLng = 'ptBR';

i18next.init({
  fallbackLng: ['en', 'ptBR'],
  lng: defaultLng,
  resources: {
    en: {
      ...enTranslation,
    },
    ptBR: {
      ...ptBrTranslation,
    },
  },
  compatibilityJSON: 'v4',
  detection: {
    order: ['cookie', 'header'], // Ordem de detecção do idioma
    caches: ['cookie'], // Onde armazenar a informação do idioma
    cookieName: 'lang', // Nome do cookie de linguagem
  },
  cache: {
    enabled: false,
  },
});

HandlebarsI18n.init();

export default {
  i18next,
  HandlebarsI18n,
  defaultLng,
};
