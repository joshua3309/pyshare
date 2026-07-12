/**
 * Billing Service — Standalone Entry Point
 * Port 4007. ALB routes /api/billing/* here.
 */
import dotenv from 'dotenv';
import { createServiceApp, startService } from '@paysphere/shared';
import routes from './routes/index.js';

dotenv.config();

const app = createServiceApp({
  serviceName: 'billing-service',
  routes,
});

const PORT = process.env.BILLING_SERVICE_PORT || process.env.PORT || 4007;

startService(app, PORT, 'billing-service');
