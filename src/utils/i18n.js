import i18next from 'i18next'
import * as HandlebarsI18n from 'handlebars-i18n'

import enTranslation from '../locale/en'
import ptBrTranslation from '../locale/ptBR'

const defaultLng = 'ptBR'

i18next.init({
  fallbackLng: ['en', 'ptBR'],
  lng: defaultLng,
  resources: {
    en: {
      ...enTranslation
    },
    ptBR: {
      ...ptBrTranslation
    }
  },
  compatibilityJSON: 'v2'
})

HandlebarsI18n.init()

export default {
  i18next,
  HandlebarsI18n,
  defaultLng
}
