import { logger } from '../utils/logger.js';

/**
 * Custom error class for service-level errors.
 * Carries statusCode + code for consistent API responses.
 */
export class ServiceError extends Error {
  constructor(message, statusCode = 400, code = 'SERVICE_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Centralized error handler middleware.
 * Expects errors to have: { statusCode, message, code }
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const code = err.code || 'INTERNAL_ERROR';

  if (statusCode >= 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      statusCode,
      service: process.env.SERVICE_NAME,
    });
  } else {
    logger.warn({
      message: err.message,
      path: req.path,
      method: req.method,
      statusCode,
      service: process.env.SERVICE_NAME,
    });
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      service: process.env.SERVICE_NAME,
      requestId: req.id,
      ...(err.details && { details: err.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      service: process.env.SERVICE_NAME,
    },
  });
}

/**
 * Async error wrapper — catches promise rejections in route handlers.
 * Usage: router.get('/x', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
