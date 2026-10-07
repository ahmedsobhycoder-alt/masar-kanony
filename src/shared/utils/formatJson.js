"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatJson = void 0;
const formatJson = ({ data, message, status }) => {
    return data ? {
        message,
        status,
        data
    } : {
        message,
        status
    };
};
exports.formatJson = formatJson;
