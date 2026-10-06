import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from "path";
i18next
.use(Backend)
.use(middleware.LanguageDetector)
.init({
  fallbackLng: 'ar',
  preload: ['ar', 'en'], // Preload all languages
  ns: ["common", "errors"], // Namespaces used in the application
  backend: {
    // Points to src/infrastructure/locales
    loadPath: path.join(__dirname, "../locales/{{lng}}/{{ns}}.json"), // Path to your translation files
  },
  defaultNS: "common", // Default namespace to use if not specified
  detection: {
    order: ["header"],
    lookupHeader: "accept-language",
    caches: false,
  }, 
  interpolation: {
    escapeValue: false,
  },
});
export default i18next;