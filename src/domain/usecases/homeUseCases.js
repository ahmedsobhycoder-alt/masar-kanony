"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeUseCases = void 0;
class HomeUseCases {
    homeRepo;
    constructor({ homeRepo }) {
        this.homeRepo = homeRepo;
    }
    getHomeData = async () => this.homeRepo.getHomeData();
}
exports.HomeUseCases = HomeUseCases;
