import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { healthCheck, readinessCheck } from './middleware/health.js';

/**
 * Creates a configured Express app for a microservice.
 *
 * Each service calls this to get a consistent setup:
 *   - Security middleware (helmet, CORS, rate limiting)
 *   - Request logging with correlation IDs
 *   - Health check endpoints for ALB target groups
 *   - Error handling
 *
 * @param {object} options - { serviceName, routes, rateLimitMax }
 * @returns {express.Application}
 */
export function createServiceApp(options = {}) {
  const { serviceName, routes, rateLimitMax = 500 } = options;

  const app = express();

  // Service identity
  app.set('serviceName', serviceName);

  // ─── Security ────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      credentials: true,
    })
  );

  // ─── Body parsing ────────────────────────────────────────────────────
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // ─── Request ID + Logging ───────────────────────────────────────────
  app.use((req, res, next) => {
    req.id = req.headers['x-request-id'] || uuidv4();
    res.setHeader('X-Request-Id', req.id);
    res.setHeader('X-Service', serviceName);
    next();
  });

  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.http(msg.trim()) },
    })
  );

  // ─── Rate Limiting ───────────────────────────────────────────────────
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
    keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip,
  });
  app.use(limiter);

  // ─── Health Checks (for ALB target groups) ──────────────────────────
  app.get('/health', healthCheck);
  app.get('/ready', readinessCheck);

  // ─── Service Routes ──────────────────────────────────────────────────
  if (routes) {
    app.use('/', routes);
  }

  // ─── Error Handling ──────────────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

/**
 * Starts a service with graceful shutdown handling.
 *
 * @param {express.Application} app - Express app
 * @param {number} port - Port to listen on
 * @param {string} serviceName - Service name for logging
 */
export function startService(app, port, serviceName) {
  const server = app.listen(port, () => {
    logger.info(`${serviceName} running on port ${port}`, {
      service: serviceName,
      port,
      env: process.env.NODE_ENV || 'development',
    });
  });

  // ─── Graceful Shutdown ──────────────────────────────────────────────
  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down ${serviceName} gracefully...`);

    server.close(async () => {
      logger.info(`${serviceName} HTTP server closed`);

      // Close database connections
      try {
        const { prisma } = await import('./config/prisma.js');
        await prisma.$disconnect();
        logger.info(`${serviceName} database connections closed`);
      } catch (err) {
        logger.error('Error closing database', { error: err.message });
      }

      process.exit(0);
    });

    // Force exit after 30s if graceful shutdown fails
    setTimeout(() => {
      logger.error(`${serviceName} forced shutdown after timeout`);
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Unhandled error handlers
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { service: serviceName, reason });
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', {
      service: serviceName,
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });

  return server;
}
