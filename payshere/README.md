# PaySphere — Financial Infrastructure for the Internet Economy

A production-grade, full-stack fintech platform built with a **true microservices architecture**. Each service runs independently, deploys independently, scales independently, and fails independently. Designed for AWS (ALB + ECS Fargate + RDS).

## Architecture Overview

---
                    ┌──────────────────────────────────────────────────┐
                    │              AWS ALB (path-based routing)          │
                    │   :443 (HTTPS) → :80 (HTTP redirect)              │
                    └──────┬──────────┬──────────┬──────────────────────┘
                           │          │          │
              /admin/*     │  /api/*  │  /*      │
                           ▼          ▼          ▼
                  ┌────────────┐  ┌─────────┐  ┌────────────┐
                  │ admin      │  │ backend │  │ web        │
                  │ ECS:3001   │  │ ECS     │  │ ECS:3000   │
                  │ Next.js    │  │ 7 svcs  │  │ Next.js    │
                  └────────────┘  └─────────┘  └────────────┘
                                         │
                                  ┌──────┴──────┐
                                  │ AWS RDS     │
                                  │ PostgreSQL  │
                                  └─────────────┘
```

```
                         ┌─────────────────────────────────┐
                         │         AWS ALB (HTTPS)          │
                         │   Path-based routing + TLS      │
                         │   Health checks per target      │
                         └──────────────┬──────────────────┘
                                        │
          ┌──────────┬──────────┬──────┴───────┬──────────┬──────────┐
          │          │          │              │          │          │
     /api/auth  /api/users  /api/payments  /api/txn  /api/wallet  /api/billing
          │          │          │              │          │          │
     ┌────┴───┐ ┌───┴───┐ ┌────┴───┐ ┌────────┴┐ ┌───┴───┐ ┌───┴───┐
     │  Auth  │ │ User  │ │Payment │ │  Txn   │ │Wallet │ │Billing│
     │Service │ │Service│ │Service │ │Service │ │Service│ │Service│
     │ :4001  │ │ :4002 │ │ :4003  │ │ :4004  │ │ :4005 │ │ :4007 │
     └────┬───┘ └───┬───┘ └────┬───┘ └────────┘ └───┬───┘ └───┬───┘
          │         │          │                     │         │
          │    ┌────┘          │                     │    ┌────┘
          │    │               │                     │    │
          └────┼───────────────┼─────────────────────┼────┘
               │               │                     │
          ┌────┴───────────────┴─────────────────────┴────┐
          │           AWS RDS PostgreSQL                  │
          │     (Multi-AZ, encrypted, RDS Proxy)           │
          └────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────────────┐
          │           Notification Service :4006           │
          │     (In-app + Email, called by all services)    │
          └────────────────────────────────────────────────┘
```

## Core Design Principles

Every architectural decision follows these principles:

1. **Independent Services** — Each microservice starts, deploys, tests, versions, and scales independently. No service depends on another's source code.

2. **High Availability** — Multi-AZ RDS, ALB health checks, ECS auto-scaling (min 2 tasks per service), circuit breakers for inter-service calls.

3. **Fault Isolation** — Circuit breaker pattern prevents cascade failures. If notification-service is down, payment-service still works (logs warning, continues).

4. **Security by Design** — JWT access + refresh tokens, service-to-service JWT auth, Helmet, rate limiting, CORS, bcrypt password hashing, RDS encryption, VPC isolation.

5. **Easy Scalability** — Each ECS service auto-scales independently based on CPU (70% threshold). Payment-service can scale to 10 tasks while notification stays at 1.

6. **Maintainable Codebase** — Shared library (`@paysphere/shared`) for common code. Each service has a single responsibility. Consistent error handling and logging.

7. **Production-Ready** — Graceful shutdown, health checks, structured JSON logging (CloudWatch-ready), request correlation IDs, deployment scripts.

## Tech Stack

### Frontend
- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** + **Framer Motion**
- **Recharts** for data visualization
- **Zod** for form validation
- **next-themes** for dark mode

### Backend
- **Node.js 20** + **Express.js** — 7 independent microservices
- **PostgreSQL** on **AWS RDS** (Multi-AZ, encrypted, RDS Proxy)
- **Prisma ORM** for type-safe database access
- **JWT** (access + refresh + service-to-service tokens)
- **Zod** for request validation
- **Winston** for structured JSON logging
- **Stripe-ready** payment integration

### Infrastructure (AWS)
- **ALB** (Application Load Balancer) — API gateway with path-based routing
- **ECS Fargate** — Serverless container hosting (one service per task)
- **RDS PostgreSQL** — Managed database with Multi-AZ + RDS Proxy
- **ECR** — Container registry (one repo per service)
- **CloudWatch** — Logs, metrics, and alarms
- **Secrets Manager** — Database credentials, JWT secrets, Stripe keys
- **VPC** — Private subnets for ECS tasks + RDS, public subnets for ALB

## Monorepo Structure

```
paysphere/
├── app/                         # Next.js frontend (App Router)
├── components/                  # React components
├── backend/
│   ├── shared/                  # @paysphere/shared npm package
│   │   └── src/
│   │       ├── app.js           # createServiceApp() factory
│   │       ├── config/prisma.js # Prisma client singleton
│   │       ├── middleware/
│   │       │   ├── auth.js      # JWT auth + service auth
│   │       │   ├── errorHandler.js
│   │       │   └── health.js   # ALB health checks
│   │       └── utils/
│   │           ├── jwt.js       # Access/refresh/service tokens
│   │           ├── logger.js    # Winston structured logging
│   │           └── httpClient.js # Inter-service HTTP + circuit breaker
│   ├── services/                # 7 independent microservices
│   │   ├── auth-service/        # Port 4001
│   │   ├── user-service/        # Port 4002
│   │   ├── payment-service/     # Port 4003
│   │   ├── transaction-service/ # Port 4004
│   │   ├── wallet-service/      # Port 4005
│   │   ├── notification-service/ # Port 4006
│   │   └── billing-service/     # Port 4007
│   ├── prisma/                  # Shared Prisma schema + seed
│   ├── deploy/
│   │   ├── aws/                 # Terraform: ALB, RDS, ECS configs
│   │   ├── docker/              # Dockerfiles + docker-compose
│   │   └── scripts/             # Deployment scripts
│   └── .env.example
└── package.json
```

## Microservices

Each service is a **standalone Express application** with its own:
- `package.json` (independent dependencies)
- `server.js` (independent entry point)
- `Dockerfile` (independent container image)
- ECS task definition (independent deployment + scaling)
- ECR repository (independent versioning)

| Service | Port | ALB Path | Responsibility | Auto-scale |
|---------|------|----------|----------------|------------|
| auth-service | 4001 | `/api/auth/*` | Login, Register, JWT, Password reset | 2-6 tasks |
| user-service | 4002 | `/api/users/*` | Profile, KYC, Account management | 2-4 tasks |
| payment-service | 4003 | `/api/payments/*` | Send/receive money, Card payments, Refunds | 2-10 tasks |
| transaction-service | 4004 | `/api/transactions/*` | History, Analytics, CSV export | 2-4 tasks |
| wallet-service | 4005 | `/api/wallet/*` | Multi-currency wallet, Top-up, Withdraw, Convert | 2-6 tasks |
| notification-service | 4006 | `/api/notifications/*` | In-app + Email notifications | 1-3 tasks |
| billing-service | 4007 | `/api/billing/*` | Invoices, Subscriptions, Receipts | 1-3 tasks |

### Inter-Service Communication

Services communicate via **HTTP** (no source code dependencies). The `@paysphere/shared` `HttpClient` provides:

- **Service Discovery** — Resolves service URLs from env vars (`SERVICE_AUTH_URL`, etc.)
- **Service-to-Service JWT** — Internal auth tokens separate from user tokens
- **Circuit Breaker** — Opens after 5 failures, prevents cascade failures
- **Automatic Retries** — Exponential backoff for 5xx errors (max 2 retries)
- **Request Correlation** — Propagates `X-Request-Id` for distributed tracing

Example: When `auth-service` registers a user, it calls `wallet-service` to create a wallet and `notification-service` to send a welcome email — all via HTTP. If either is down, registration still succeeds (async retry).

### Internal Endpoints

Services expose `/internal/*` endpoints for other services:
- `POST /internal/create` (wallet) — Create wallet for new user
- `POST /internal/deduct` (wallet) — Deduct funds for payment
- `POST /internal/credit` (wallet) — Credit funds for refund
- `POST /internal/send` (notification) — Send notification to user

These are protected by `authenticateService` middleware (service-to-service JWT).

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or Docker)
- AWS CLI (for production deployment)

### 1. Install all dependencies
```bash
cd backend
npm run install:all
# Installs: root, shared library, and all 7 services
```

### 2. Set up environment variables
```bash
cp backend/.env.example backend/.env
# Edit with your database URL and JWT secrets
```

### 3. Set up the database
```bash
cd backend
npx prisma generate --schema prisma/schema.prisma
npx prisma migrate dev --schema prisma/schema.prisma --name init
npm install bcryptjs
npm run prisma:seed
```

### 4. Run services locally (development)

Each service runs independently on its own port:

```bash
# Terminal 1 — Auth service
npm run dev:auth    # → http://localhost:4001

# Terminal 2 — User service
npm run dev:user    # → http://localhost:4002

# Terminal 3 — Payment service
npm run dev:payment # → http://localhost:4003

# ... or run all at once:
npm run dev:all
```

### 5. Run with Docker (production-like)
```bash
cd backend
npm run docker:up   # Starts all services + PostgreSQL
```

### 6. Run the frontend
```bash
npm run dev   # → http://localhost:3000
```

### Demo Account
- Email: `sarah@flowcommerce.com`
- Password: `Password123!`

## AWS Deployment

### Infrastructure (Terraform)
The `deploy/aws/` directory contains Terraform configurations for:
- `alb.tf` — ALB with path-based routing to 7 target groups
- `rds.tf` — RDS PostgreSQL (Multi-AZ, encrypted, RDS Proxy)
- `ecs.tf` — ECS cluster, task definitions, services, auto-scaling, ECR repos

```bash
cd backend/deploy/aws
terraform init
terraform plan
terraform apply
```

### Deploy a Single Service (zero downtime for others)
```bash
./deploy/scripts/deploy-service.sh auth v1.2.0
# Builds, pushes to ECR, updates ECS task, waits for stability
# Other services are NOT affected
```

### Deploy All Services
```bash
./deploy/scripts/deploy-all.sh v1.2.0
# Deploys each service sequentially with fault isolation
# If one fails, others continue
```

## API Endpoints

### Auth Service (port 4001)
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in
- `POST /api/auth/refresh` — Refresh access token
- `POST /api/auth/logout` — Sign out
- `POST /api/auth/forgot-password` — Request reset link
- `POST /api/auth/reset-password` — Reset password

### User Service (port 4002)
- `GET /api/users/me` — Get profile
- `PUT /api/users/me` — Update profile
- `POST /api/users/kyc` — Submit KYC
- `GET /api/users/kyc` — Check KYC status

### Payment Service (port 4003)
- `POST /api/payments/send` — Send money
- `POST /api/payments/request` — Request money
- `POST /api/payments/bill` — Pay bill
- `POST /api/payments/card` — Process card payment (Stripe-ready)
- `POST /api/payments/refund/:id` — Refund transaction

### Wallet Service (port 4005)
- `GET /api/wallet` — Get wallet balances
- `POST /api/wallet/topup` — Add funds
- `POST /api/wallet/withdraw` — Withdraw funds
- `POST /api/wallet/convert` — Currency conversion

### Transaction Service (port 4004)
- `GET /api/transactions` — List (paginated, filterable, searchable)
- `GET /api/transactions/analytics` — Aggregated analytics
- `GET /api/transactions/export` — Export as CSV
- `GET /api/transactions/:id` — Get single transaction

### Billing Service (port 4007)
- `GET /api/billing/invoices` — List invoices
- `POST /api/billing/invoices` — Create invoice
- `POST /api/billing/invoices/:id/send` — Send invoice
- `GET /api/billing/subscriptions` — List subscriptions
- `POST /api/billing/subscriptions` — Create subscription

### Notification Service (port 4006)
- `GET /api/notifications` — List notifications
- `POST /api/notifications/mark-read/:id` — Mark as read
- `POST /api/notifications/mark-all-read` — Mark all as read

### Health Checks (all services)
- `GET /health` — Liveness check (ALB target group)
- `GET /ready` — Readiness check (database connectivity)

## Security Features
- **JWT access tokens** (15min) + **refresh token rotation** (7d)
- **Service-to-service JWT** — separate secret for internal API calls
- **bcrypt** password hashing (12 rounds)
- **Helmet** for HTTP security headers
- **Rate limiting** per service (configurable, stricter for auth)
- **CORS** with configurable origins
- **Zod** input validation on all endpoints
- **Prisma** parameterized queries (SQL injection protection)
- **Role-based authorization** (USER, ADMIN, MERCHANT)
- **RDS encryption** at rest + in transit
- **VPC isolation** — ECS tasks + RDS in private subnets
- **Secrets Manager** for credentials
- **Request correlation IDs** for audit trails

## Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure RDS PostgreSQL connection string
- [ ] Generate strong JWT secrets: `openssl rand -hex 32`
- [ ] Set `JWT_SERVICE_SECRET` for inter-service auth
- [ ] Configure `SERVICE_*_URL` env vars (ALB internal DNS or Cloud Map)
- [ ] Add Stripe keys for live payments
- [ ] Configure SMTP for email notifications
- [ ] Run `npx prisma migrate deploy`
- [ ] Set up CloudWatch alarms for health check failures
- [ ] Configure ALB access logs
- [ ] Enable ECS container insights
- [ ] Set up RDS automated backups (7-day retention)

## License
MIT
