import { createI18n } from 'vue-i18n'
import auth from '@/locales/en/auth.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      ...Object.assign({
        auth
      })
    }
  }
})

export default i18n
