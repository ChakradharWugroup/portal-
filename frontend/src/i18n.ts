import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// In a real app, these would be imported from separate JSON files.
// For now, we are providing the boilerplate to migrate the translations.
const resources = {
  en: {
    translation: {
      "dashboard": {
        "welcome": "Welcome to Smart Enterprise AI Platform"
      }
    }
  },
  'zh-TW': {
    translation: {
      "dashboard": {
        "welcome": "歡迎來到智能企業AI平台"
      }
    }
  },
  'zh-CN': {
    translation: {
      "dashboard": {
        "welcome": "欢迎来到智能企业AI平台"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
