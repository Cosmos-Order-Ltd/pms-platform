import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  return res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
};

export const createError = (message: string, statusCode: number = 500): ApiError => {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};