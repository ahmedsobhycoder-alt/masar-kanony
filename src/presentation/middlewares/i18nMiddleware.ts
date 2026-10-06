import i18n from "../../infrastructure/config/i18n";
import middleware from "i18next-http-middleware"; 
const i18nMiddleware = middleware.handle(i18n); // Create a middleware function that uses i18next-http-middleware to handle language detection and translation
export default i18nMiddleware;