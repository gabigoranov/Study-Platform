import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import bg from './locales/bg/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      bg: {
        translation: bg,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });


// Load saved lang BEFORE the app renders
const savedLang = localStorage.getItem("lang");
if (savedLang) i18n.changeLanguage(savedLang);

export default i18n;