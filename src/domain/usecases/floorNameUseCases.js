"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorNameUseCases = void 0;
class FloorNameUseCases {
    floorNameRepo;
    constructor({ floorNameRepo }) {
        this.floorNameRepo = floorNameRepo;
    }
    createFloorName = async (floorNameData) => this.floorNameRepo.createFloorName(floorNameData);
    getFloorNames = async (query = {}) => this.floorNameRepo.getFloorNames(query);
    getFloorNameById = async (id) => this.floorNameRepo.getFloorNameById(id);
    deleteFloorNameById = async (id) => this.floorNameRepo.deleteFloorNameById(id);
    countDocuments = async () => this.floorNameRepo.countDocuments();
}
exports.FloorNameUseCases = FloorNameUseCases;
