import { createI18n } from 'vue-i18n'
import vi from './locale/vi.json'
import en from './locale/en.json'


const language = window.localStorage.getItem('locale')
function loadLocaleMessages() {
  console.log('lang', language)
  const locales = [
    {
      vi: vi
    },
    {
      en: en
    }
  ]
  const messages = {}
  locales.forEach(lang => {
    const key = Object.keys(lang)
    messages[key] = lang[key]
  })
  return messages;
}

export default createI18n({
  locale: language,
  fallbackLocale: 'vi',
  messages: loadLocaleMessages()
})

