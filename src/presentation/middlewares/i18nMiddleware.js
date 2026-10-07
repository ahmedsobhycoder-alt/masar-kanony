"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("../../infrastructure/config/i18n"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const i18nMiddleware = i18next_http_middleware_1.default.handle(i18n_1.default); // Create a middleware function that uses i18next-http-middleware to handle language detection and translation
exports.default = i18nMiddleware;
