"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
// Custom error class
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.AppError = AppError;
// Error handler middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    logger_1.default.error(`${req.method} ${req.url} - ${message}`);
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
    });
};
exports.errorHandler = errorHandler;
