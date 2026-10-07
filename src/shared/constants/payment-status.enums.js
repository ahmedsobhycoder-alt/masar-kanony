"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatusValues = exports.PaymentStatus = void 0;
// Define the enum
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["CANCELED"] = "CANCELED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
const PaymentStatusValues = Object.values(PaymentStatus);
exports.PaymentStatusValues = PaymentStatusValues;
exports.default = PaymentStatus;
