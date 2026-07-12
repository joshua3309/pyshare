/**
 * Notification Service — Standalone Entry Point
 * Port 4006. ALB routes /api/notifications/* here.
 *
 * Also exposes /internal/send for other services to trigger notifications.
 */
import dotenv from 'dotenv';
import { createServiceApp, startService } from '@paysphere/shared';
import routes from './routes/index.js';

dotenv.config();

const app = createServiceApp({
  serviceName: 'notification-service',
  routes,
});

const PORT = process.env.NOTIFICATION_SERVICE_PORT || process.env.PORT || 4006;

startService(app, PORT, 'notification-service');
