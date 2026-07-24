# PaySphere wallet Service — Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app/services/wallet-service

# Copy dependency manifests first (better cache utilization)

COPY package*.json /app/
COPY prisma /app/prisma
COPY shared /app/shared

WORKDIR /app
RUN npm install

WORKDIR /app/shared
RUN npm install --omit=dev

WORKDIR /app/services/wallet-service
COPY services/wallet-service/package*.json ./
RUN npm install --omit=dev

RUN npx prisma generate --schema /app/prisma/schema.prisma && \
    ls -la /app/shared/node_modules/.prisma/client

FROM node:20-alpine AS runner
WORKDIR /app/services/wallet-service
ENV NODE_ENV=production
ENV SERVICE_NAME=wallet-service

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

COPY --from=deps /app/services/wallet-service/node_modules ./node_modules
COPY --from=deps /app/shared /app/shared
COPY --from=deps /app/prisma /app/prisma
COPY services/wallet-service/src ./src
COPY services/wallet-service/package.json ./

USER nodejs
EXPOSE 4005

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4005/health || exit 1

CMD ["node", "src/server.js"]
