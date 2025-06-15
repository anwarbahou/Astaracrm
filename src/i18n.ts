
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const namespaces = [
  'app', 'dashboard', 'clients', 'contacts', 'deals', 'activityLogs',
  'notes', 'common', 'countries', 'industries', 'clientStages',
  'toasts', 'addClientModal', 'addContactModal', 'landingPage'
];

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    ns: namespaces,
    defaultNS: namespaces,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    react: {
      useSuspense: true,
    }
  });

export default i18n;
