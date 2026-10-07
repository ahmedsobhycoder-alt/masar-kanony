"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityUseCases = void 0;
class CityUseCases {
    cityRepo;
    constructor({ cityRepo }) {
        this.cityRepo = cityRepo;
    }
    createCity = async (cityData) => this.cityRepo.createCity(cityData);
    getCities = async (query = {}) => this.cityRepo.getCities(query);
    getCityById = async (id) => this.cityRepo.getCityById(id);
    deleteCityById = async (id) => this.cityRepo.deleteCityById(id);
}
exports.CityUseCases = CityUseCases;
