# PaySphere Auth Service — Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app/services/auth-service

# Copy dependency manifests first (better cache utilization)

COPY package*.json /app/
COPY prisma /app/prisma
COPY shared /app/shared

WORKDIR /app
RUN npm install

WORKDIR /app/shared
RUN npm install --omit=dev

WORKDIR /app/services/auth-service
COPY services/auth-service/package*.json ./
RUN npm install --omit=dev

RUN npx prisma generate --schema /app/prisma/schema.prisma && \
    ls -la /app/shared/node_modules/.prisma/client

FROM node:20-alpine AS runner
WORKDIR /app/services/auth-service
ENV NODE_ENV=production
ENV SERVICE_NAME=auth-service

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

COPY --from=deps /app/services/auth-service/node_modules ./node_modules
COPY --from=deps /app/shared /app/shared
COPY --from=deps /app/prisma /app/prisma
COPY services/auth-service/src ./src
COPY services/auth-service/package.json ./

USER nodejs
EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4001/health || exit 1

CMD ["node", "src/server.js"]
