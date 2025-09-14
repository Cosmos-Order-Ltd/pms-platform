"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isOperational = err.isOperational || false;
    console.error(`[ERROR] ${req.method} ${req.path}:`, err);
    // Development error response
    if (process.env.NODE_ENV === 'development') {
        return res.status(statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            isOperational
        });
    }
    // Production error response
    if (isOperational) {
        return res.status(statusCode).json({
            success: false,
            message: err.message
        });
    }
    // Don't leak error details in production
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
};
exports.errorHandler = errorHandler;
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
//# sourceMappingURL=errorHandler.js.map