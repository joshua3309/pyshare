# ─── PaySphere Admin Frontend — Dockerfile ────────────────────────────────
#
# Admin Next.js app (admin login, admin dashboard).
# Runs on port 3001. ALB routes /admin/* to this service.
# basePath: /admin is set in next.config.mjs.
#
# Build (from repo root):
#   docker build -t paysphere/admin -f apps/admin/Dockerfile .
# Run:
#   docker run -p 3001:3001 paysphere/admin

# ─── Stage 1: Dependencies ────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/ui/package.json ./packages/ui/

RUN npm install --workspace admin --workspace @workspace/ui --omit=dev

# ─── Stage 2: Builder ──────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules

COPY package.json ./
COPY apps/admin/ ./apps/admin/
COPY packages/ui/ ./packages/ui/

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace admin

# ─── Stage 3: Production Runner ───────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/package.json ./apps/admin/package.json
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/next.config.mjs ./apps/admin/next.config.mjs
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/package.json ./packages/ui/package.json
COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/src ./packages/ui/src
COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/tailwind.config.js ./packages/ui/tailwind.config.js

USER nextjs
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/admin || exit 1

WORKDIR /app/apps/admin
CMD ["npx", "next", "start"]
