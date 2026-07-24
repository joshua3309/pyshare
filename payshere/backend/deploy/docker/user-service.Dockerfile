# PaySphere user Service — Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app/services/user-service

# Copy dependency manifests first (better cache utilization)

COPY package*.json /app/
COPY prisma /app/prisma
COPY shared /app/shared

WORKDIR /app
RUN npm install

WORKDIR /app/shared
RUN npm install --omit=dev

WORKDIR /app/services/user-service
COPY services/user-service/package*.json ./
RUN npm install --omit=dev

RUN npx prisma generate --schema /app/prisma/schema.prisma && \
    ls -la /app/shared/node_modules/.prisma/client

FROM node:20-alpine AS runner
WORKDIR /app/services/user-service
ENV NODE_ENV=production
ENV SERVICE_NAME=user-service

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

COPY --from=deps /app/services/user-service/node_modules ./node_modules
COPY --from=deps /app/shared /app/shared
COPY --from=deps /app/prisma /app/prisma
COPY services/user-service/src ./src
COPY services/user-service/package.json ./

USER nodejs
EXPOSE 4002

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4002/health || exit 1

CMD ["node", "src/server.js"]
