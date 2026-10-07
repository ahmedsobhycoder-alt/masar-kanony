"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppConfigUseCases {
    appConfigRepository;
    constructor({ appConfigRepository }) {
        this.appConfigRepository = appConfigRepository;
    }
    getAppConfig = () => this.appConfigRepository.getAppConfig();
    createAppConfig = (appConfig) => this.appConfigRepository.createAppConfig(appConfig);
    updateAppConfig = (appConfig) => this.appConfigRepository.updateAppConfig(appConfig);
}
exports.default = AppConfigUseCases;
