import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma client per service.
 * Each microservice gets its own connection pool to RDS.
 *
 * Connection pool sizing (production):
 *   - Each service: max 5-10 connections
 *   - RDS max_connections: ~80 (db.t3.medium) — enough for 7 services × 10
 */
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
