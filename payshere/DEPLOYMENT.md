# PaySphere — Deployment Guide

Complete deployment instructions for the PaySphere microservice architecture on AWS ECS Fargate with ALB path-based routing and RDS PostgreSQL.

---

## Architecture Overview

```
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

### Services

| Service | Container Port | ALB Path | Description |
|---------|---------------|----------|-------------|
| web | 3000 | `/*` (default) | User-facing app: landing, login, register, dashboard |
| admin | 3001 | `/admin/*` | Admin app: admin login, admin dashboard |
| auth-service | 4001 | `/api/auth/*` | Authentication, JWT, login/register |
| user-service | 4002 | `/api/users/*` | User profiles, KYC |
| payment-service | 4003 | `/api/payments/*` | Payment processing, Stripe |
| transaction-service | 4004 | `/api/transactions/*` | Transaction history, records |
| wallet-service | 4005 | `/api/wallet/*` | Wallet balances, transfers |
| notification-service | 4006 | `/api/notifications/*` | Email/push notifications |
| billing-service | 4007 | `/api/billing/*` | Invoicing, billing cycles |

### ALB Listener Rule Priorities

| Priority | Path Pattern | Target Group |
|----------|-------------|-------------|
| 10 | `/admin/*`, `/admin` | admin-tg |
| 100-106 | `/api/auth/*` ... `/api/billing/*` | service-specific |
| 200 | `/*` (default) | web-tg |

---

## Prerequisites

1. **AWS CLI** v2 installed and configured (`aws configure`)
2. **Docker** installed (for building container images)
3. **Terraform** >= 1.5 (for infrastructure provisioning)
4. **Node.js** 20+ and **npm** (for local development)
5. An AWS account with permissions for ECS, ALB, RDS, ECR, IAM, VPC

---

## Phase 1: Local Development

### 1.1 Install Dependencies

```bash
# From the project root
npm install
```

This installs all workspace dependencies for `apps/web`, `apps/admin`, and `packages/ui`.

### 1.2 Run Frontend Apps (Development)

```bash
# Terminal 1 — user-facing app (port 3000)
npm run dev:web

# Terminal 2 — admin app (port 3001)
npm run dev:admin
```

- Web app: http://localhost:3000
- Admin app: http://localhost:3001/admin

### 1.3 Run Full Stack with Docker Compose

```bash
# From the project root — starts all 9 services + PostgreSQL
docker-compose up

# Or run only the frontends
docker-compose up web admin

# Scale the web service
docker-compose up --scale web=3
```

Service URLs when running via Docker Compose:
- Web: http://localhost:3000
- Admin: http://localhost:3001/admin
- Auth API: http://localhost:4001
- User API: http://localhost:4002
- Payment API: http://localhost:4003
- Transaction API: http://localhost:4004
- Wallet API: http://localhost:4005
- Notification API: http://localhost:4006
- Billing API: http://localhost:4007

---

## Phase 2: Provision AWS Infrastructure (Terraform)

### 2.1 Initialize Terraform

```bash
cd backend/deploy/aws
terraform init
```

### 2.2 Review the Plan

```bash
terraform plan
```

This provisions:
- **VPC** with 2 public + 2 private subnets across 2 AZs
- **ALB** with path-based listener rules (web, admin, 7 API services)
- **RDS PostgreSQL 16** (db.t3.medium, Multi-AZ, encrypted)
- **ECS Fargate cluster** with 9 services (2 frontend + 7 backend)
- **ECR repositories** for each service
- **Secrets Manager** for DB credentials and JWT secrets
- **Security groups** with least-privilege rules
- **CloudWatch** log groups for each service
- **RDS Proxy** for connection pooling

### 2.3 Apply

```bash
terraform apply
```

Note the outputs:
- `alb_dns_name` — the ALB DNS (e.g., `paysphere-alb-123456.us-east-1.elb.amazonaws.com`)
- `ecr_repository_urls` — ECR URLs for pushing images
- `rds_endpoint` — RDS endpoint (for DATABASE_URL)

---

## Phase 3: Build and Push Container Images

### 3.1 Authenticate Docker to ECR

```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

### 3.2 Build and Push Frontend Images

```bash
# From the project root

# Build web image
docker build -t paysphere/web -f apps/web/Dockerfile .
docker tag paysphere/web:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/paysphere/web:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/paysphere/web:latest

# Build admin image
docker build -t paysphere/admin -f apps/admin/Dockerfile .
docker tag paysphere/admin:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/paysphere/admin:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/paysphere/admin:latest
```

### 3.3 Build and Push Backend Images

```bash
# From the backend directory
cd backend

# Build each microservice
for service in auth user payment transaction wallet notification billing; do
  docker build \
    -t paysphere/${service}-service:latest \
    -f deploy/docker/${service}-service.Dockerfile \
    .
  docker tag paysphere/${service}-service:latest \
    <account-id>.dkr.ecr.us-east-1.amazonaws.com/paysphere/${service}-service:latest
  docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/paysphere/${service}-service:latest
done
```

### 3.4 Or Use the Deploy Script

```bash
cd backend
./deploy/scripts/deploy-all.sh latest
```

---

## Phase 4: Deploy to ECS

### 4.1 Update ECS Task Definitions

After pushing new images, update the ECS services to pull the latest images:

```bash
# Force a new deployment for each service (pulls latest image)
for service in web admin auth-service user-service payment-service \
  transaction-service wallet-service notification-service billing-service; do
  aws ecs update-service \
    --cluster paysphere \
    --service paysphere-${service} \
    --force-new-deployment \
    --region us-east-1
done
```

### 4.2 Verify Deployment

```bash
# Check service status
aws ecs describe-services \
  --cluster paysphere \
  --services paysphere-web paysphere-admin \
  --region us-east-1

# Check target group health
aws elbv2 describe-target-health \
  --target-group-arn <web-target-group-arn> \
  --region us-east-1
```

### 4.3 Access the Application

- **User app**: `https://<alb-dns-name>/`
- **Admin app**: `https://<alb-dns-name>/admin`
- **API endpoints**: `https://<alb-dns-name>/api/auth/*`, etc.

---

## Phase 5: DNS and TLS (Optional but Recommended)

### 5.1 Route53 DNS

```bash
# Create an A record (alias) pointing to the ALB
aws route53 change-resource-record-sets \
  --hosted-zone-id <zone-id> \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "paysphere.example.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "<alb-dns-name>",
          "EvaluateTargetHealth": true,
          "HostedZoneId": "<alb-hosted-zone-id>"
        }
      }
    }]
  }'
```

### 5.2 TLS Certificate

Attach an ACM certificate to the ALB HTTPS listener:

```bash
# Request a certificate
aws acm request-certificate \
  --domain-name paysphere.example.com \
  --validation-method DNS \
  --region us-east-1
```

Update the Terraform `aws_lb_listener` resource to use the certificate ARN.

---

## Environment Variables

### Frontend Services

| Variable | Web | Admin | Description |
|----------|-----|-------|-------------|
| `NODE_ENV` | production | production | Runtime mode |
| `PORT` | 3000 | 3001 | Container listen port |
| `NEXT_PUBLIC_API_URL` | `https://<alb>/api` | `https://<alb>/api` | Backend API base URL |

### Backend Services

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | RDS PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Yes | JWT access token signing secret |
| `JWT_REFRESH_SECRET` | Yes | JWT refresh token signing secret |
| `JWT_SERVICE_SECRET` | Yes | Inter-service JWT signing secret |
| `STRIPE_SECRET_KEY` | Payment only | Stripe API key |
| `SMTP_HOST` | Notification only | SMTP server host |
| `SMTP_PORT` | Notification only | SMTP server port |
| `SMTP_USER` | Notification only | SMTP username |
| `SMTP_PASS` | Notification only | SMTP password |

### Managing Secrets

Secrets are stored in AWS Secrets Manager. ECS tasks retrieve them at runtime:

```bash
# Update a secret
aws secretsmanager update-secret \
  --secret-id paysphere/jwt/access-secret \
  --secret-string "your-new-secret"
```

---

## Monitoring and Logs

### CloudWatch Logs

Each service writes logs to `/ecs/paysphere/<service-name>`:

```bash
# Tail web app logs
aws logs tail /ecs/paysphere/web --follow --region us-east-1

# Tail admin app logs
aws logs tail /ecs/paysphere/admin --follow --region us-east-1
```

### ALB Health Checks

| Service | Health Check Path |
|---------|------------------|
| web | `GET /` |
| admin | `GET /admin` |
| Backend services | `GET /health` |

---

## Scaling

### Auto-Scaling Configuration

Each ECS service has auto-scaling configured via Terraform:

| Service | Min | Max | Scale Trigger |
|---------|-----|-----|---------------|
| web | 2 | 4 | CPU > 70% |
| admin | 1 | 2 | CPU > 70% |
| auth-service | 2 | 5 | CPU > 70% |
| Other backend | 1 | 3 | CPU > 70% |

### Manual Scaling

```bash
# Scale web to 4 instances
aws ecs update-service \
  --cluster paysphere \
  --service paysphere-web \
  --desired-count 4 \
  --region us-east-1
```

---

## Troubleshooting

### Frontend won't load

1. Check ALB target group health:
   ```bash
   aws elbv2 describe-target-health \
     --target-group-arn <web-tg-arn> \
     --region us-east-1
   ```
2. Check ECS task logs:
   ```bash
   aws logs tail /ecs/paysphere/web --follow --region us-east-1
   ```
3. Verify the container is listening on the correct port (3000 for web, 3001 for admin).

### Admin app returns 404

- The admin app uses `basePath: /admin`. Ensure ALB routes `/admin/*` to the admin target group **without** stripping the path prefix.
- The admin health check path is `/admin` (not `/`).

### API calls fail

- Verify the ALB listener rules are in priority order: admin (10) > API services (100-106) > web (200).
- Check that `NEXT_PUBLIC_API_URL` is set correctly in the frontend containers.

### Database connection issues

- Verify the RDS security group allows inbound from the ECS security group on port 5432.
- Check `DATABASE_URL` in Secrets Manager matches the RDS endpoint.
- If using RDS Proxy, ensure the proxy is configured and the URL points to the proxy endpoint.

---

## File Structure

```
project-root/
├── apps/
│   ├── web/                      # User-facing Next.js app
│   │   ├── Dockerfile           # Web container (port 3000)
│   │   ├── next.config.mjs      # transpilePackages + standalone output
│   │   ├── tailwind.config.ts   # Extends shared config
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   ├── app/                 # Routes: /, /login, /dashboard/*
│   │   └── components/          # Landing, auth, dashboard components
│   │
│   └── admin/                   # Admin Next.js app
│       ├── Dockerfile           # Admin container (port 3001)
│       ├── next.config.mjs      # basePath: /admin + standalone
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       ├── package.json
│       ├── app/                 # Routes: / (login), /dashboard/*
│       └── components/          # Admin layout
│
├── packages/
│   └── ui/                      # Shared UI library (@workspace/ui)
│       ├── package.json
│       ├── tailwind.config.ts   # Shared Tailwind config
│       └── src/
│           ├── index.ts         # Barrel export
│           ├── components/ui/   # All shadcn/ui components
│           ├── components/theme-provider.tsx
│           ├── hooks/use-toast.ts
│           ├── lib/utils.ts     # cn() helper
│           └── styles/globals.css
│
├── backend/
│   ├── services/                # 7 backend microservices
│   ├── shared/                  # Shared backend library
│   ├── deploy/
│   │   ├── docker/              # Backend Dockerfiles + docker-compose
│   │   ├── aws/                 # Terraform (ALB, ECS, RDS)
│   │   └── scripts/             # Deploy scripts
│   └── prisma/                  # Database schema
│
├── docker-compose.yml           # Full stack: 2 frontend + 7 backend + DB
├── package.json                 # Workspace root
└── .dockerignore
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all workspace dependencies |
| `npm run dev:web` | Run web app on :3000 |
| `npm run dev:admin` | Run admin app on :3001 |
| `npm run build` | Build both frontend apps |
| `docker-compose up` | Run full stack locally |
| `docker-compose up web admin` | Run only frontends |
| `terraform apply` | Provision AWS infrastructure |
| `./backend/deploy/scripts/deploy-all.sh` | Build & push all backend images |
