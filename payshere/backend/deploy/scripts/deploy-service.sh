#!/usr/bin/env bash

set -euo pipefail

############################################################
# PaySphere Deployment Script v1
#
# Builds and pushes ONE service to ECR.
#
# Usage:
#
# ./deploy/scripts/deploy-service.sh auth v1.0.0
# ./deploy/scripts/deploy-service.sh user latest
# ./deploy/scripts/deploy-service.sh web v2.0.0
#
############################################################

SERVICE="${1:?Usage: deploy-service.sh <service> [tag]}"
TAG="${2:-latest}"

############################################################
# AWS
############################################################

AWS_REGION="us-east-1"
ACCOUNT_ID="033481624720"

############################################################
# Directories
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# payshere/backend
BACKEND_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# payshere
PROJECT_DIR="$(cd "$BACKEND_DIR/.." && pwd)"

############################################################
# Repository / Dockerfile
############################################################

case "$SERVICE" in

    auth)
        REPOSITORY="paysphere-auth"
        DOCKERFILE="$BACKEND_DIR/deploy/docker/auth-service.Dockerfile"
        BUILD_CONTEXT="$BACKEND_DIR"
        ;;

    user)
        REPOSITORY="paysphere-user"
        DOCKERFILE="$BACKEND_DIR/deploy/docker/user-service.Dockerfile"
        BUILD_CONTEXT="$BACKEND_DIR"
        ;;

    payment)
        REPOSITORY="paysphere-payment"
        DOCKERFILE="$BACKEND_DIR/deploy/docker/payment-service.Dockerfile"
        BUILD_CONTEXT="$BACKEND_DIR"
        ;;

    transaction)
        REPOSITORY="paysphere-transaction"
        DOCKERFILE="$BACKEND_DIR/deploy/docker/transaction-service.Dockerfile"
        BUILD_CONTEXT="$BACKEND_DIR"
        ;;

    wallet)
        REPOSITORY="paysphere-wallet"
        DOCKERFILE="$BACKEND_DIR/deploy/docker/wallet-service.Dockerfile"
        BUILD_CONTEXT="$BACKEND_DIR"
        ;;

    notification)
        REPOSITORY="paysphere-notification"
        DOCKERFILE="$BACKEND_DIR/deploy/docker/notification-service.Dockerfile"
        BUILD_CONTEXT="$BACKEND_DIR"
        ;;

    billing)
        REPOSITORY="paysphere-billing"
        DOCKERFILE="$BACKEND_DIR/deploy/docker/billing-service.Dockerfile"
        BUILD_CONTEXT="$BACKEND_DIR"
        ;;

    web)
        REPOSITORY="paysphere-web"
        DOCKERFILE="$PROJECT_DIR/apps/web/Dockerfile"
        BUILD_CONTEXT="$PROJECT_DIR"
        ;;

    admin)
        REPOSITORY="paysphere-admin"
        DOCKERFILE="$PROJECT_DIR/apps/admin/Dockerfile"
        BUILD_CONTEXT="$PROJECT_DIR"
        ;;

    *)
        echo
        echo "Unknown service: $SERVICE"
        exit 1
        ;;
esac

############################################################
# Checks
############################################################

if [[ ! -f "$DOCKERFILE" ]]; then
    echo
    echo "Dockerfile not found:"
    echo "$DOCKERFILE"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo
    echo "Docker daemon is not running."
    exit 1
fi

aws ecr describe-repositories \
    --repository-names "$REPOSITORY" \
    --region "$AWS_REGION" >/dev/null

############################################################
# Image
############################################################

IMAGE="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPOSITORY}:${TAG}"

echo
echo "======================================================"
echo "PaySphere Deployment"
echo "======================================================"
echo "Service      : $SERVICE"
echo "Repository   : $REPOSITORY"
echo "Tag          : $TAG"
echo "Dockerfile   : $DOCKERFILE"
echo "Context      : $BUILD_CONTEXT"
echo "Image        : $IMAGE"
echo "======================================================"
echo

############################################################
# Login
############################################################

echo "Logging into Amazon ECR..."

aws ecr get-login-password \
    --region "$AWS_REGION" \
| docker login \
    --username AWS \
    --password-stdin "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

############################################################
# Build
############################################################

echo
echo "Building Docker image..."
echo

docker build \
    -t "$IMAGE" \
    -f "$DOCKERFILE" \
    "$BUILD_CONTEXT"

############################################################
# Push
############################################################

echo
echo "Pushing image..."
echo

docker push "$IMAGE"

############################################################
# Verify Push
############################################################

echo
echo "Verifying image exists in ECR..."
echo

aws ecr describe-images \
    --repository-name "$REPOSITORY" \
    --region "$AWS_REGION" \
    --image-ids imageTag="$TAG" >/dev/null

############################################################
# Success
############################################################

echo
echo "======================================================"
echo "Deployment Successful!"
echo
echo "Image pushed to:"
echo
echo "$IMAGE"
echo
echo "Next step:"
echo "Update prod.auto.tfvars"
echo "Run terraform apply"
echo "======================================================"