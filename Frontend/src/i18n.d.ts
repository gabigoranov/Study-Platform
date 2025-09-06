import 'react-i18next';
import en from '../locales/en/translation.json';
import bg from '../locales/bg/translation.json';
declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en;
      translation: typeof bg;
    };
  }
}