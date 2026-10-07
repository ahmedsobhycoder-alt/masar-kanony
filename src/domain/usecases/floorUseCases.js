"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorUseCases = void 0;
class FloorUseCases {
    floorRepo;
    constructor({ floorRepo }) {
        this.floorRepo = floorRepo;
    }
    createFloor = async (floorData) => this.floorRepo.createFloor(floorData);
    getFloors = async (query = {}) => this.floorRepo.getFloors(query);
    getFloorById = async (id) => this.floorRepo.getFloorById(id);
    deleteFloorById = async (id) => this.floorRepo.deleteFloorById(id);
    countDocuments = async () => this.floorRepo.countDocuments();
}
exports.FloorUseCases = FloorUseCases;
