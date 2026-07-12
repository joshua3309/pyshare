#!/bin/bash
# ─── PaySphere — Deploy ALL Microservices ────────────────────────────────
#
# Usage: ./deploy/scripts/deploy-all.sh [tag]
#
# Deploys all 7 microservices sequentially. Each deployment is independent.
# If one fails, the script continues with the next (fault isolation).

set -euo pipefail

TAG="${1:-latest}"
SERVICES=("auth" "user" "payment" "transaction" "wallet" "notification" "billing")

echo "━━━ Deploying all PaySphere services (tag: ${TAG}) ━━━"
echo ""

FAILED=()
for service in "${SERVICES[@]}"; do
  echo ""
  echo "━━━ Deploying ${service}... ━━━"
  if ./deploy/scripts/deploy-service.sh "${service}" "${TAG}"; then
    echo "✓ ${service} deployed"
  else
    echo "✗ ${service} FAILED — continuing with next service"
    FAILED+=("${service}")
  fi
done

echo ""
echo "━━━ Deployment Summary ━━━"
if [ ${#FAILED[@]} -eq 0 ]; then
  echo "✓ All services deployed successfully!"
else
  echo "✗ Failed services: ${FAILED[*]}"
  echo "  These services need manual intervention."
  echo "  Other services are running normally."
fi
