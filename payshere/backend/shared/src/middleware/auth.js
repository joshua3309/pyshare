import { ServiceError } from '../middleware/errorHandler.js';
import { verifyAccessToken, verifyServiceToken } from '../utils/jwt.js';

/**
 * Authentication middleware — verifies JWT from Authorization header.
 * Attaches `req.user = { userId, role }` on success.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ServiceError('Authentication required', 401, 'AUTH_REQUIRED'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Optional authentication — attaches user if token is valid, but does not fail.
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = { userId: decoded.userId, role: decoded.role };
  } catch (err) {
    // Silently ignore — optional auth
  }
  next();
}

/**
 * Role-based authorization. Usage: authorize('ADMIN')
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ServiceError('Authentication required', 401, 'AUTH_REQUIRED'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ServiceError('Insufficient permissions', 403, 'FORBIDDEN'));
    }
    next();
  };
}

/**
 * Service-to-service authentication.
 * Verifies internal JWT token for inter-service API calls.
 * The ALB internal listener or service mesh injects this token.
 */
export function authenticateService(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ServiceError('Service authentication required', 401, 'SERVICE_AUTH_REQUIRED'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyServiceToken(token);
    req.service = { name: decoded.service, type: decoded.type };
    next();
  } catch (err) {
    next(err);
  }
}
