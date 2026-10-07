"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeTypeUseCases = void 0;
class OfficeTypeUseCases {
    officeTypeRepo;
    constructor({ officeTypeRepo }) {
        this.officeTypeRepo = officeTypeRepo;
    }
    createOfficeType = async (officeTypeData) => this.officeTypeRepo.createOfficeType(officeTypeData);
    getOfficeTypes = async (query = {}) => this.officeTypeRepo.getOfficeTypes(query);
    getOfficeTypeById = async (id) => this.officeTypeRepo.getOfficeTypeById(id);
    deleteOfficeTypeById = async (id) => this.officeTypeRepo.deleteOfficeTypeById(id);
}
exports.OfficeTypeUseCases = OfficeTypeUseCases;
