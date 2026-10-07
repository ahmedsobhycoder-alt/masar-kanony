"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourtTypeUseCases = void 0;
class CourtTypeUseCases {
    courtTypeRepo;
    constructor({ courtTypeRepo }) {
        this.courtTypeRepo = courtTypeRepo;
    }
    createCourtType = async (courtTypeData) => this.courtTypeRepo.createCourtType(courtTypeData);
    getCourtTypes = async (query = {}) => this.courtTypeRepo.getCourtTypes(query);
    getCourtTypeById = async (id) => this.courtTypeRepo.getCourtTypeById(id);
    deleteCourtTypeById = async (id) => this.courtTypeRepo.deleteCourtTypeById(id);
    countDocuments = async () => this.courtTypeRepo.countDocuments();
}
exports.CourtTypeUseCases = CourtTypeUseCases;
