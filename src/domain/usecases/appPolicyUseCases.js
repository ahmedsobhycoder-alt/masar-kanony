"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppPolicyUseCases {
    appPolicyRepo;
    constructor({ appPolicyRepo }) {
        this.appPolicyRepo = appPolicyRepo;
    }
    getAppPolicy = async (type) => this.appPolicyRepo.getAppPolicy(type);
    createAppPolicy = async (appPolicy) => this.appPolicyRepo.createAppPolicy(appPolicy);
    updateAppPolicy = async (appPolicy) => this.appPolicyRepo.updateAppPolicy(appPolicy);
}
exports.default = AppPolicyUseCases;
