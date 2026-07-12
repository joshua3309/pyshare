import jwt from 'jsonwebtoken';
import { ServiceError } from '../middleware/errorHandler.js';

/**
 * JWT access token signing.
 * @param {object} payload - { userId, role, service? }
 * @returns {string} Signed JWT (short-lived: 15min default)
 */
export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    issuer: 'paysphere',
    audience: 'paysphere-api',
  });
}

/**
 * JWT refresh token signing (long-lived: 7d default).
 */
export function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    issuer: 'paysphere',
    audience: 'paysphere-api',
  });
}

/**
 * Verify a JWT access token.
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      issuer: 'paysphere',
      audience: 'paysphere-api',
    });
  } catch (err) {
    throw new ServiceError('Invalid or expired token', 401, 'INVALID_TOKEN');
  }
}

/**
 * Verify a JWT refresh token.
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'paysphere',
      audience: 'paysphere-api',
    });
  } catch (err) {
    throw new ServiceError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }
}

/**
 * Generate a service-to-service token (internal API calls).
 * Uses a separate secret so user tokens can't be used for internal calls.
 */
export function signServiceToken(serviceName) {
  return jwt.sign({ service: serviceName, type: 'internal' }, process.env.JWT_SERVICE_SECRET, {
    expiresIn: '1h',
    issuer: 'paysphere-internal',
  });
}

/**
 * Verify a service-to-service token.
 */
export function verifyServiceToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SERVICE_SECRET, {
      issuer: 'paysphere-internal',
    });
  } catch (err) {
    throw new ServiceError('Invalid service token', 401, 'INVALID_SERVICE_TOKEN');
  }
}
