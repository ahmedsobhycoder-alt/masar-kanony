"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
class UserController {
    userUseCases;
    constructor({ userUseCases }) {
        this.userUseCases = userUseCases;
    }
    getUsers = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.userUseCases.getUsers(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: { list: data, paginationResult: pagination },
            message: req.t("Users fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    getUserById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const userId = req.params.id;
        const user = await this.userUseCases.getUserById(userId);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: user,
            message: req.t("User fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    deleteUserById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const userId = req.params.id;
        const deletedUser = await this.userUseCases.deleteUserById(userId);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: deletedUser,
            message: req.t("User deleted successfully", { ns: "common" }),
            status: true,
        }));
    });
}
exports.UserController = UserController;
exports.default = UserController;
