"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyprusValidationError = exports.formatGeofencingError = exports.formatValidationError = exports.formatErrorResponse = exports.notFoundHandler = exports.asyncHandler = exports.RateLimitError = exports.CourierError = exports.GeofencingError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.APIError = void 0;
const winston_1 = __importDefault(require("winston"));
class APIError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode = 500, code, details) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.code = code || 'INTERNAL_ERROR';
        this.details = details;
        Error.captureStackTrace(this, APIError);
    }
}
exports.APIError = APIError;
class ValidationError extends APIError {
    constructor(message, details) {
        super(message, 400, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends APIError {
    constructor(resource, id) {
        const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
        super(message, 404, 'NOT_FOUND', { resource, id });
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends APIError {
    constructor(message = 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED');
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends APIError {
    constructor(message = 'Forbidden access') {
        super(message, 403, 'FORBIDDEN');
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends APIError {
    constructor(message, details) {
        super(message, 409, 'CONFLICT', details);
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
class GeofencingError extends APIError {
    constructor(message, details) {
        super(message, 422, 'GEOFENCING_ERROR', details);
        this.name = 'GeofencingError';
    }
}
exports.GeofencingError = GeofencingError;
class CourierError extends APIError {
    constructor(message, details) {
        super(message, 502, 'COURIER_ERROR', details);
        this.name = 'CourierError';
    }
}
exports.CourierError = CourierError;
class RateLimitError extends APIError {
    constructor(message = 'Rate limit exceeded') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
        this.name = 'RateLimitError';
    }
}
exports.RateLimitError = RateLimitError;
const logger = winston_1.default.createLogger({
    level: 'error',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.File({ filename: './logs/error.log' }),
        new winston_1.default.transports.Console()
    ]
});
const errorHandler = (error, req, res, next) => {
    const errorContext = {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString(),
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack
        }
    };
    if (error instanceof APIError) {
        logger.warn('API Error:', {
            ...errorContext,
            statusCode: error.statusCode,
            code: error.code,
            details: error.details
        });
        res.status(error.statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
                timestamp: new Date().toISOString(),
                requestId: req.requestId,
                service: 'Cyprus Access Control (CAC)'
            }
        });
        return;
    }
    if (error.name === 'ValidationError') {
        logger.warn('Validation Error:', errorContext);
        res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Request validation failed',
                details: error.message,
                timestamp: new Date().toISOString(),
                requestId: req.requestId,
                service: 'Cyprus Access Control (CAC)'
            }
        });
        return;
    }
    if (error.name === 'SyntaxError') {
        logger.warn('JSON Syntax Error:', errorContext);
        res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_JSON',
                message: 'Invalid JSON in request body',
                timestamp: new Date().toISOString(),
                requestId: req.requestId,
                service: 'Cyprus Access Control (CAC)'
            }
        });
        return;
    }
    if (error.message.includes('ECONNREFUSED') || error.message.includes('connect ECONNREFUSED')) {
        logger.error('Database Connection Error:', errorContext);
        res.status(503).json({
            success: false,
            error: {
                code: 'DATABASE_UNAVAILABLE',
                message: 'Database service temporarily unavailable',
                timestamp: new Date().toISOString(),
                requestId: req.requestId,
                service: 'Cyprus Access Control (CAC)'
            }
        });
        return;
    }
    if (error.message.includes('duplicate key value')) {
        logger.warn('Database Duplicate Key Error:', errorContext);
        res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_ENTRY',
                message: 'A record with this information already exists',
                timestamp: new Date().toISOString(),
                requestId: req.requestId,
                service: 'Cyprus Access Control (CAC)'
            }
        });
        return;
    }
    if (error.name === 'JsonWebTokenError') {
        logger.warn('JWT Error:', errorContext);
        res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Invalid authentication token',
                timestamp: new Date().toISOString(),
                requestId: req.requestId,
                service: 'Cyprus Access Control (CAC)'
            }
        });
        return;
    }
    if (error.name === 'TokenExpiredError') {
        logger.warn('JWT Expired Error:', errorContext);
        res.status(401).json({
            success: false,
            error: {
                code: 'TOKEN_EXPIRED',
                message: 'Authentication token has expired',
                timestamp: new Date().toISOString(),
                requestId: req.requestId,
                service: 'Cyprus Access Control (CAC)'
            }
        });
        return;
    }
    if (error.message.includes('LIMIT_FILE_SIZE')) {
        logger.warn('File Size Error:', errorContext);
        res.status(413).json({
            success: false,
            error: {
                code: 'FILE_TOO_LARGE',
                message: 'Uploaded file exceeds size limit',
                timestamp: new Date().toISOString(),
                requestId: req.requestId,
                service: 'Cyprus Access Control (CAC)'
            }
        });
        return;
    }
    if (error.message.includes('Rate limit')) {
        logger.warn('Rate Limit Error:', errorContext);
        res.status(429).json({
            success: false,
            error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many requests. Please try again later.',
                timestamp: new Date().toISOString(),
                requestId: req.requestId,
                service: 'Cyprus Access Control (CAC)',
                retryAfter: '15 minutes'
            }
        });
        return;
    }
    if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
        logger.error('External Service Error:', errorContext);
        res.status(502).json({
            success: false,
            error: {
                code: 'EXTERNAL_SERVICE_ERROR',
                message: 'External service temporarily unavailable',
                timestamp: new Date().toISOString(),
                requestId: req.requestId,
                service: 'Cyprus Access Control (CAC)'
            }
        });
        return;
    }
    logger.error('Unhandled Error:', errorContext);
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            timestamp: new Date().toISOString(),
            requestId: req.requestId,
            service: 'Cyprus Access Control (CAC)',
            ...(isDevelopment && {
                details: {
                    message: error.message,
                    stack: error.stack
                }
            })
        }
    });
};
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError('Endpoint', req.originalUrl);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
const formatErrorResponse = (code, message, statusCode = 500, details, requestId) => {
    return {
        success: false,
        error: {
            code,
            message,
            details,
            timestamp: new Date().toISOString(),
            requestId,
            service: 'Cyprus Access Control (CAC)'
        }
    };
};
exports.formatErrorResponse = formatErrorResponse;
const formatValidationError = (error) => {
    const details = error.details?.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
    }));
    return new ValidationError('Request validation failed', { validationErrors: details });
};
exports.formatValidationError = formatValidationError;
const formatGeofencingError = (message, coordinates, distance, allowedRadius) => {
    return new GeofencingError(message, {
        coordinates,
        distance,
        allowedRadius,
        helpText: 'Ensure you are physically present at the designated location'
    });
};
exports.formatGeofencingError = formatGeofencingError;
class CyprusValidationError extends ValidationError {
    constructor(field, value, expectedFormat) {
        super(`Invalid Cyprus ${field} format`, {
            field,
            value,
            expectedFormat,
            helpText: 'Please ensure you are using the correct Cyprus format'
        });
    }
}
exports.CyprusValidationError = CyprusValidationError;
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map