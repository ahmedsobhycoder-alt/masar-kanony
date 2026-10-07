"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
const printColors_1 = require("../../shared/utils/printColors");
const payment_status_enums_1 = __importDefault(require("../../shared/constants/payment-status.enums"));
class PaymentController {
    paymentUseCases;
    constructor(paymentUseCases) {
        this.paymentUseCases = paymentUseCases;
    }
    createPayment = (0, express_async_handler_1.default)(async (req, res, next) => {
        (0, printColors_1.printBlue)("req.body", JSON.stringify(req.body));
        const paymentData = req.body;
        (0, printColors_1.printBlue)("req.user", req.user.id);
        paymentData.user = req.user?.id; // Assuming req.user is populated by authentication middleware
        paymentData.status = payment_status_enums_1.default.PENDING; // Set default status to PENDING
        const createdPayment = await this.paymentUseCases.createPayment(paymentData);
        res.status(201).json((0, formatJson_1.formatJson)({
            data: createdPayment,
            message: req.t("Payment created successfully", { ns: "common" }),
            status: true,
        }));
    });
    getPayments = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.paymentUseCases.getPayments(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: { list: data, paginationResult: pagination },
            message: req.t("Payments fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    getPaymentById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { id } = req.params;
        const payment = await this.paymentUseCases.getPaymentById(id);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: payment,
            message: req.t("Payment fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    approvePayment = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { id } = req.params;
        const approvedPayment = await this.paymentUseCases.approvePayment(id);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: approvedPayment,
            message: req.t("Payment approved successfully", { ns: "common" }),
            status: true,
        }));
    });
    declinePayment = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { id } = req.params;
        const declinedPayment = await this.paymentUseCases.declinePayment(id);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: declinedPayment,
            message: req.t("Payment declined successfully", { ns: "common" }),
            status: true,
        }));
    });
    updatePaymentStatus = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { id } = req.params;
        const { status } = req.body;
        const updatedPayment = await this.paymentUseCases.updatePaymentStatus(id, status);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: updatedPayment,
            message: req.t("Payment status updated successfully", { ns: "common" }),
            status: true,
        }));
    });
    deletePaymentById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { id } = req.params;
        const deletedPayment = await this.paymentUseCases.deletePaymentById(id);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: deletedPayment,
            message: req.t("Payment deleted successfully", { ns: "common" }),
            status: true,
        }));
    });
}
exports.default = PaymentController;
