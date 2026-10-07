"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernorateUseCases = void 0;
class GovernorateUseCases {
    governorateRepo;
    constructor({ governorateRepo }) {
        this.governorateRepo = governorateRepo;
    }
    createGovernorate = async (governorateData) => this.governorateRepo.createGovernorate(governorateData);
    getGovernorates = async (query) => this.governorateRepo.getGovernorates(query);
    getGovernorateById = async (id) => this.governorateRepo.getGovernorateById(id);
    deleteGovernorateById = async (id) => this.governorateRepo.deleteGovernorateById(id);
}
exports.GovernorateUseCases = GovernorateUseCases;
