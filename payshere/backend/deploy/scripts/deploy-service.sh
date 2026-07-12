#!/bin/bash
# ─── PaySphere — Deploy a Single Microservice to AWS ECS ──────────────────
#
# Usage: ./deploy/scripts/deploy-service.sh <service-name> [tag]
#
# This script builds, pushes, and deploys ONE microservice independently.
# Other services are not affected — zero downtime for the rest of the platform.
#
# Prerequisites:
#   - AWS CLI configured with ECR/ECS permissions
#   - Docker installed
#   - ECR repositories created (see deploy/aws/ecs.tf)

set -euo pipefail

SERVICE_NAME="${1:?Usage: deploy-service.sh <service-name> [tag]}"
TAG="${2:-latest}"
AWS_REGION="${AWS_REGION:-us-east-1}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
CLUSTER_NAME="paysphere-cluster"

echo "━━━ Deploying ${SERVICE_NAME} (tag: ${TAG}) ━━━"

# ─── 1. Authenticate Docker to ECR ───────────────────────────────────────
echo "▸ Authenticating to ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | \
  docker login --username AWS --password-stdin "${ECR_URI}"

# ─── 2. Build Docker Image ───────────────────────────────────────────────
echo "▸ Building Docker image..."
DOCKERFILE="deploy/docker/${SERVICE_NAME}.Dockerfile"
if [ ! -f "../${DOCKERFILE}" ]; then
  echo "✗ Dockerfile not found: ${DOCKERFILE}"
  exit 1
fi

docker build \
  -t "${ECR_URI}/paysphere/${SERVICE_NAME}:${TAG}" \
  -f "../${DOCKERFILE}" \
  ..

# ─── 3. Push to ECR ──────────────────────────────────────────────────────
echo "▸ Pushing to ECR..."
docker push "${ECR_URI}/paysphere/${SERVICE_NAME}:${TAG}"

# ─── 4. Update ECS Task Definition ───────────────────────────────────────
echo "▸ Updating ECS task definition..."
TASK_FAMILY="paysphere-${SERVICE_NAME}"
CURRENT_TASK=$(aws ecs describe-task-definition \
  --task-definition "${TASK_FAMILY}" \
  --region "${AWS_REGION}" \
  --query 'taskDefinition' \
  --output json)

# Update image in task definition
NEW_TASK=$(echo "${CURRENT_TASK}" | \
  jq --arg IMAGE "${ECR_URI}/paysphere/${SERVICE_NAME}:${TAG}" \
  '.containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)')

NEW_TASK_ARN=$(aws ecs register-task-definition \
  --cli-input-json "${NEW_TASK}" \
  --region "${AWS_REGION}" \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)

# ─── 5. Update ECS Service (rolling deployment) ──────────────────────────
echo "▸ Updating ECS service (rolling deployment)..."
aws ecs update-service \
  --cluster "${CLUSTER_NAME}" \
  --service "paysphere-${SERVICE_NAME}" \
  --task-definition "${NEW_TASK_ARN}" \
  --region "${AWS_REGION}"

# ─── 6. Wait for Deployment ──────────────────────────────────────────────
echo "▸ Waiting for deployment to stabilize..."
aws ecs wait services-stable \
  --cluster "${CLUSTER_NAME}" \
  --services "paysphere-${SERVICE_NAME}" \
  --region "${AWS_REGION}"

echo "━━━ ${SERVICE_NAME} deployed successfully! ━━━"
echo ""
echo "  Service: paysphere-${SERVICE_NAME}"
echo "  Image:   ${ECR_URI}/paysphere/${SERVICE_NAME}:${TAG}"
echo "  Status:  STABLE"
echo ""
echo "  Other services were not affected."
