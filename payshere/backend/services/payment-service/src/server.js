/**
 * Payment Service — Standalone Entry Point
 * Port 4003. ALB routes /api/payments/* here.
 */
import dotenv from 'dotenv';
import { createServiceApp, startService } from '@paysphere/shared';
import routes from './routes/index.js';

dotenv.config();

const app = createServiceApp({
  serviceName: 'payment-service',
  routes,
  rateLimitMax: 300,
});

const PORT = process.env.PAYMENT_SERVICE_PORT || process.env.PORT || 4003;

startService(app, PORT, 'payment-service');
