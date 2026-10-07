"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OfficeUseCases {
    officeRepo;
    constructor({ officeRepo }) {
        this.officeRepo = officeRepo;
    }
    createOffice(officeData) {
        return this.officeRepo.createOffice(officeData);
    }
    getOffices(query = {}) {
        return this.officeRepo.getOffices(query);
    }
    getOfficeById(id) {
        return this.officeRepo.getOfficeById(id);
    }
    deleteOfficeById(id) {
        return this.officeRepo.deleteOfficeById(id);
    }
}
exports.default = OfficeUseCases;
