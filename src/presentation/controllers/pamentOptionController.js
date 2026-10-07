"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
const printColors_1 = require("../../shared/utils/printColors");
class PaymentOptionController {
    paymentOptionUseCases;
    constructor(paymentOptionUseCases) {
        this.paymentOptionUseCases = paymentOptionUseCases;
    }
    createPaymentOption = (0, express_async_handler_1.default)(async (req, res, next) => {
        (0, printColors_1.printBlue)("req.body", JSON.stringify(req.body));
        const paymentOptionData = req.body;
        const createdPaymentOption = await this.paymentOptionUseCases.createPaymentOption(paymentOptionData);
        // Add return here
        res.status(201).json((0, formatJson_1.formatJson)({
            data: createdPaymentOption,
            message: req.t("Payment option created successfully", { ns: "common" }),
            status: true
        }));
    });
    getPaymentOptions = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.paymentOptionUseCases.getPaymentOptions(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({ data: { list: data, paginationResult: pagination }, message: req.t("Payment options fetched successfully", { ns: "common" }), status: true }));
    });
}
exports.default = PaymentOptionController;
