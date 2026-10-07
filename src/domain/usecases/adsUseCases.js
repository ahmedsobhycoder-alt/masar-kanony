"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsUseCases = void 0;
class AdsUseCases {
    adsRepo;
    constructor({ adsRepo }) {
        this.adsRepo = adsRepo;
    }
    createAd = async (adData) => this.adsRepo.createAd(adData);
    getAds = async (query = {}) => this.adsRepo.getAds(query);
    getAdById = async (id) => this.adsRepo.getAdById(id);
    deleteAdById = async (id) => this.adsRepo.deleteAdById(id);
    countDocuments = async () => this.adsRepo.countDocuments();
}
exports.AdsUseCases = AdsUseCases;
