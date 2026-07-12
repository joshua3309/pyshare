# ─── PaySphere Microservice Dockerfile ────────────────────────────────────
# Multi-stage build for any PaySphere microservice.
#
# Usage (from service directory):
#   docker build -t paysphere/auth-service .
#
# Or with docker-compose from backend root:
#   docker-compose up

# ─── Stage 1: Dependencies ────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy shared library first
COPY ../../shared ./shared

# Copy service package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# ─── Stage 2: Build ───────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema ../../shared/node_modules/@prisma/client/schema.prisma || true

# ─── Stage 3: Production ──────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app ./

# Install only production Prisma client
RUN npm install @prisma/client && npx prisma generate || true

USER nodejs

EXPOSE 4000

# Health check (ALB uses this to determine target health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-4000}/health || exit 1

CMD ["node", "src/server.js"]
