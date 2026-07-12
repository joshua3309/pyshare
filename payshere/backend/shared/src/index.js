/**
 * @paysphere/shared — Barrel export
 *
 * All microservices import from this package:
 *   import { prisma, signAccessToken, authenticate, ServiceError, createServiceApp } from '@paysphere/shared'
 */

export { prisma } from './config/prisma.js';
export { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, signServiceToken, verifyServiceToken } from './utils/jwt.js';
export { logger } from './utils/logger.js';
export { ServiceError, errorHandler, notFoundHandler, asyncHandler } from './middleware/errorHandler.js';
export { authenticate, optionalAuth, authorize, authenticateService } from './middleware/auth.js';
export { httpClient, ServiceDiscovery, HttpClient } from './utils/httpClient.js';
export { healthCheck, readinessCheck } from './middleware/health.js';
export { createServiceApp, startService } from './app.js';
