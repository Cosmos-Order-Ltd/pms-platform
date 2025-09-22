/**
 * Cyprus Access Control (CAC) - Error Handling Middleware
 * Comprehensive error handling for the invitation orchestration service
 */

import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// Error types
export class APIError extends Error {
  public statusCode: number;
  public code: string;
  public details?: Record<string, any>;

  constructor(message: string, statusCode: number = 500, code?: string, details?: Record<string, any>) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code || 'INTERNAL_ERROR';
    this.details = details;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, APIError);
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
    super(message, 404, 'NOT_FOUND', { resource, id });
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string = 'Forbidden access') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 409, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}

export class GeofencingError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 422, 'GEOFENCING_ERROR', details);
    this.name = 'GeofencingError';
  }
}

export class CourierError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 502, 'COURIER_ERROR', details);
    this.name = 'CourierError';
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

// Logger setup
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: './logs/error.log' }),
    new winston.transports.Console()
  ]
});

/**
 * Main error handler middleware
 */
const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  // Log error details
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

  // Determine if this is an API error with custom handling
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

  // Handle specific error types
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

  // Database errors
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

  // JWT errors
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

  // File upload errors
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

  // Rate limiting errors
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

  // Network/External API errors
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

  // Generic server errors
  logger.error('Unhandled Error:', errorContext);

  // Don't leak error details in production
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

/**
 * Async error wrapper to catch async errors in route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError('Endpoint', req.originalUrl);
  next(error);
};

/**
 * Custom error response formatter
 */
export const formatErrorResponse = (
  code: string,
  message: string,
  statusCode: number = 500,
  details?: Record<string, any>,
  requestId?: string
) => {
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

/**
 * Validation error formatter for Joi
 */
export const formatValidationError = (error: any): ValidationError => {
  const details = error.details?.map((detail: any) => ({
    field: detail.path.join('.'),
    message: detail.message,
    value: detail.context?.value
  }));

  return new ValidationError('Request validation failed', { validationErrors: details });
};

/**
 * Geofencing-specific error formatter
 */
export const formatGeofencingError = (
  message: string,
  coordinates?: { lat: number; lng: number },
  distance?: number,
  allowedRadius?: number
): GeofencingError => {
  return new GeofencingError(message, {
    coordinates,
    distance,
    allowedRadius,
    helpText: 'Ensure you are physically present at the designated location'
  });
};

/**
 * Cyprus-specific validation errors
 */
export class CyprusValidationError extends ValidationError {
  constructor(field: string, value: any, expectedFormat: string) {
    super(`Invalid Cyprus ${field} format`, {
      field,
      value,
      expectedFormat,
      helpText: 'Please ensure you are using the correct Cyprus format'
    });
  }
}

export default errorHandler;