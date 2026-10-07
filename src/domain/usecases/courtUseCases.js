"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourtUseCases = void 0;
class CourtUseCases {
    courtRepo;
    constructor({ courtRepo }) {
        this.courtRepo = courtRepo;
    }
    async createCourt(courtData) {
        return await this.courtRepo.createCourt(courtData);
    }
    async getAllCourts(query = {}) {
        return await this.courtRepo.getCourts(query);
    }
    async getCourtById(id) {
        return await this.courtRepo.getCourtById(id);
    }
    async getMostSeenCourts(query = {}) {
        return await this.courtRepo.getMostSeenCourts(query);
    }
}
exports.CourtUseCases = CourtUseCases;
