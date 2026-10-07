"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedTo = exports.protect = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
const userModel_1 = __importDefault(require("../../infrastructure/database/models/userModel"));
const printColors_1 = require("../../shared/utils/printColors");
exports.protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new apiError_1.default(401, req.t("unauthorized", { ns: "errors" })));
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const currentUser = await userModel_1.default.findById(decoded.id);
    if (!currentUser) {
        return next(new apiError_1.default(401, req.t("user_not_found", { ns: "errors" })));
    }
    if (currentUser.passwordChangedAt) {
        const passChangedSeconds = Math.floor(currentUser.passwordChangedAt.getTime() / 1000);
        if (passChangedSeconds > decoded.iat) {
            return next(new apiError_1.default(401, req.t("password_changed", { ns: "errors" })));
        }
    }
    // Attach currentUser to req.user
    req.user = currentUser;
    (0, printColors_1.printBlue)("req.user", req.user);
    next();
});
const allowedTo = (roles) => (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    (0, printColors_1.printBlue)("roles", roles);
    (0, printColors_1.printBlue)("req.user.role", user?.role);
    if (!user || !roles.includes(user.role)) {
        return next(new apiError_1.default(403, req.t("forbidden", { ns: "errors" })));
    }
    next();
});
exports.allowedTo = allowedTo;
