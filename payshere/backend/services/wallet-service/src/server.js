/**
 * Wallet Service — Standalone Entry Point
 * Port 4005. ALB routes /api/wallet/* here.
 *
 * Also exposes /internal/* endpoints for other services (payment-service, auth-service).
 * Internal endpoints are protected by service-to-service JWT auth.
 */
import dotenv from 'dotenv';
import { createServiceApp, startService } from '@paysphere/shared';
import routes from './routes/index.js';

dotenv.config();

const app = createServiceApp({
  serviceName: 'wallet-service',
  routes,
});

const PORT = process.env.WALLET_SERVICE_PORT || process.env.PORT || 4005;

startService(app, PORT, 'wallet-service');
