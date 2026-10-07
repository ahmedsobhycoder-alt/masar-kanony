"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCases = void 0;
class UserUseCases {
    userRepo;
    constructor({ userRepo }) {
        this.userRepo = userRepo;
    }
    getUsers = async (query = {}) => this.userRepo.getUsers(query);
    getUserById = async (id) => this.userRepo.getUserById(id);
    deleteUserById = async (id) => this.userRepo.deleteUserById(id);
    countDocuments = async () => this.userRepo.countDocuments();
}
exports.UserUseCases = UserUseCases;
exports.default = UserUseCases;
