/**
 * Auth Service — Standalone Entry Point
 *
 * Runs independently on port 4001 (configurable via PORT env).
 * The AWS ALB routes /api/auth/* to this service's target group.
 *
 * Independent: own package.json, own server, own deployment, own scaling.
 */
import dotenv from 'dotenv';
import { createServiceApp, startService } from '@paysphere/shared';
import routes from './routes/index.js';

dotenv.config();

const app = createServiceApp({
  serviceName: 'auth-service',
  routes,
  rateLimitMax: 200, // Stricter rate limit for auth endpoints
});

const PORT = process.env.AUTH_SERVICE_PORT || process.env.PORT || 4001;

startService(app, PORT, 'auth-service');
