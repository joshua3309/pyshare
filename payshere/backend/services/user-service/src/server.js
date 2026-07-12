/**
 * User Service — Standalone Entry Point
 * Port 4002. ALB routes /api/users/* here.
 */
import dotenv from 'dotenv';
import { createServiceApp, startService } from '@paysphere/shared';
import routes from './routes/index.js';

dotenv.config();

const app = createServiceApp({
  serviceName: 'user-service',
  routes,
});

const PORT = process.env.USER_SERVICE_PORT || process.env.PORT || 4002;

startService(app, PORT, 'user-service');
