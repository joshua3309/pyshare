# ─── PaySphere Web Frontend — Dockerfile ───────────────────────────────────
#
# User-facing Next.js app (landing, login, register, dashboard).
# Runs on port 3000. ALB routes /* to this service.
#
# Build (from repo root):
#   docker build -t paysphere/web -f apps/web/Dockerfile .
# Run:
#   docker run -p 3000:3000 paysphere/web

# ─── Stage 1: Dependencies ────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/

RUN npm install --workspace web --workspace @workspace/ui --omit=dev

# ─── Stage 2: Builder ──────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules

COPY package.json ./
COPY apps/web/ ./apps/web/
COPY packages/ui/ ./packages/ui/

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace web

# ─── Stage 3: Production Runner ───────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/next.config.mjs ./apps/admin/next.config.mjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/next.config.mjs ./apps/web/next.config.mjs
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/package.json ./packages/ui/package.json
COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/src ./packages/ui/src
COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/tailwind.config.js ./packages/ui/tailwind.config.js

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

WORKDIR /app/apps/web
CMD ["npx", "next", "start"]
