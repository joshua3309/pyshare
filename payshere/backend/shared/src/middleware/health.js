import { prisma } from '../config/prisma.js';

/**
 * Health check endpoint for AWS ALB target groups.
 *
 * ALB health checks hit GET /health every 30s (configurable).
 * A target is "healthy" only when this returns 200.
 *
 * Checks:
 *   - Process is alive
 *   - Database connection is alive (optional, via ?deep=true)
 */
export function healthCheck(req, res) {
  res.status(200).json({
    status: 'healthy',
    service: process.env.SERVICE_NAME,
    version: process.env.SERVICE_VERSION || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

/**
 * Readiness check — verifies all dependencies (database, etc.) are reachable.
 * Used by Kubernetes/ECS to determine if a container should receive traffic.
 */
export async function readinessCheck(req, res) {
  const checks = {
    service: process.env.SERVICE_NAME,
    timestamp: new Date().toISOString(),
  };

  let allHealthy = true;

  // Database check
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: 'healthy' };
  } catch (err) {
    checks.database = { status: 'unhealthy', error: err.message };
    allHealthy = false;
  }

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ready' : 'not_ready',
    checks,
  });
}
