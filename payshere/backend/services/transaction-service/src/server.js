/**
 * Transaction Service — Standalone Entry Point
 * Port 4004. ALB routes /api/transactions/* here.
 */
import dotenv from 'dotenv';
import { createServiceApp, startService } from '@paysphere/shared';
import routes from './routes/index.js';

dotenv.config();

const app = createServiceApp({
  serviceName: 'transaction-service',
  routes,
});

const PORT = process.env.TRANSACTION_SERVICE_PORT || process.env.PORT || 4004;

startService(app, PORT, 'transaction-service');
