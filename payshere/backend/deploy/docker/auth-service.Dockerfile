# PaySphere Auth Service — Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app

# Copy shared library
COPY shared ./shared
RUN cd shared && npm install --omit=dev

# Copy service
COPY services/auth-service/package.json services/auth-service/package-lock.json* ./
RUN npm install --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV SERVICE_NAME=auth-service

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/shared ./shared
COPY services/auth-service/src ./src
COPY services/auth-service/package.json ./
COPY prisma ./prisma

RUN npx prisma generate --schema prisma/schema.prisma

USER nodejs
EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4001/health || exit 1

CMD ["node", "src/server.js"]
