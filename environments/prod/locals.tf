locals {
  
  # ------------------------------------------------------------------
  # ECR Repositories
  # ------------------------------------------------------------------
  ecr_registry = "${var.account_id}.dkr.ecr.${var.region}.amazonaws.com"

  auth_repository         = "${local.ecr_registry}/paysphere-auth"
  user_repository         = "${local.ecr_registry}/paysphere-user"
  payment_repository      = "${local.ecr_registry}/paysphere-payment"
  transaction_repository  = "${local.ecr_registry}/paysphere-transaction"
  wallet_repository       = "${local.ecr_registry}/paysphere-wallet"
  notification_repository = "${local.ecr_registry}/paysphere-notification"
  billing_repository      = "${local.ecr_registry}/paysphere-billing"
  web_repository          = "${local.ecr_registry}/paysphere-web"
  admin_repository        = "${local.ecr_registry}/paysphere-admin"

  # ------------------------------------------------------------------
  # Environment Variables

  auth_env = {
    NODE_ENV           = "production"
    SERVICE_NAME       = "auth-service"
    PORT               = "4001"

    JWT_ACCESS_EXPIRY  = "15m"
    JWT_REFRESH_EXPIRY = "7d"

    SERVICE_USER_URL         = "http://user:4002"
    SERVICE_PAYMENT_URL      = "http://payment:4003"
    SERVICE_TRANSACTION_URL  = "http://transaction:4004"
    SERVICE_WALLET_URL       = "http://wallet:4005"
    SERVICE_NOTIFICATION_URL = "http://notification:4006"
    SERVICE_BILLING_URL      = "http://billing:4007"
  }

  user_env = {
    NODE_ENV     = "production"
    SERVICE_NAME = "user-service"
    PORT         = "4002"

    SERVICE_AUTH_URL         = "http://auth:4001"
    SERVICE_PAYMENT_URL      = "http://payment:4003"
    SERVICE_TRANSACTION_URL  = "http://transaction:4004"
    SERVICE_WALLET_URL       = "http://wallet:4005"
    SERVICE_NOTIFICATION_URL = "http://notification:4006"
    SERVICE_BILLING_URL      = "http://billing:4007"
  }

  payment_env = {
    NODE_ENV     = "production"
    SERVICE_NAME = "payment-service"
    PORT         = "4003"

    SERVICE_AUTH_URL         = "http://auth:4001"
    SERVICE_USER_URL         = "http://user:4002"
    SERVICE_TRANSACTION_URL  = "http://transaction:4004"
    SERVICE_WALLET_URL       = "http://wallet:4005"
    SERVICE_NOTIFICATION_URL = "http://notification:4006"
    SERVICE_BILLING_URL      = "http://billing:4007"
  }

  transaction_env = {
    NODE_ENV     = "production"
    SERVICE_NAME = "transaction-service"
    PORT         = "4004"

    SERVICE_AUTH_URL         = "http://auth:4001"
    SERVICE_USER_URL         = "http://user:4002"
    SERVICE_PAYMENT_URL      = "http://payment:4003"
    SERVICE_WALLET_URL       = "http://wallet:4005"
    SERVICE_NOTIFICATION_URL = "http://notification:4006"
    SERVICE_BILLING_URL      = "http://billing:4007"
  }

  wallet_env = {
    NODE_ENV     = "production"
    SERVICE_NAME = "wallet-service"
    PORT         = "4005"

    SERVICE_AUTH_URL         = "http://auth:4001"
    SERVICE_USER_URL         = "http://user:4002"
    SERVICE_PAYMENT_URL      = "http://payment:4003"
    SERVICE_TRANSACTION_URL  = "http://transaction:4004"
    SERVICE_NOTIFICATION_URL = "http://notification:4006"
    SERVICE_BILLING_URL      = "http://billing:4007"
  }

  notification_env = {
    NODE_ENV     = "production"
    SERVICE_NAME = "notification-service"
    PORT         = "4006"

    SERVICE_AUTH_URL        = "http://auth:4001"
    SERVICE_USER_URL        = "http://user:4002"
    SERVICE_PAYMENT_URL     = "http://payment:4003"
    SERVICE_TRANSACTION_URL = "http://transaction:4004"
    SERVICE_WALLET_URL      = "http://wallet:4005"
    SERVICE_BILLING_URL     = "http://billing:4007"
  }

  billing_env = {
    NODE_ENV     = "production"
    SERVICE_NAME = "billing-service"
    PORT         = "4007"

    SERVICE_AUTH_URL         = "http://auth:4001"
    SERVICE_USER_URL         = "http://user:4002"
    SERVICE_PAYMENT_URL      = "http://payment:4003"
    SERVICE_TRANSACTION_URL  = "http://transaction:4004"
    SERVICE_WALLET_URL       = "http://wallet:4005"
    SERVICE_NOTIFICATION_URL = "http://notification:4006"
  }

  web_env = {
    NODE_ENV           = "production"
    SERVICE_NAME       = "web"
    PORT               = "3000"

    NEXT_PUBLIC_API_URL = "https://api.downloadloadbriefly.shop"

    SERVICE_AUTH_URL         = "http://auth:4001"
    SERVICE_USER_URL         = "http://user:4002"
    SERVICE_PAYMENT_URL      = "http://payment:4003"
    SERVICE_TRANSACTION_URL  = "http://transaction:4004"
    SERVICE_WALLET_URL       = "http://wallet:4005"
    SERVICE_NOTIFICATION_URL = "http://notification:4006"
    SERVICE_BILLING_URL      = "http://billing:4007"
  }

  admin_env = {
    NODE_ENV     = "production"
    SERVICE_NAME = "admin"
    PORT         = "3001"

    NEXT_PUBLIC_API_URL = "https://api.downloadloadbriefly.shop"

    SERVICE_AUTH_URL         = "http://auth:4001"
    SERVICE_USER_URL         = "http://user:4002"
    SERVICE_PAYMENT_URL      = "http://payment:4003"
    SERVICE_TRANSACTION_URL  = "http://transaction:4004"
    SERVICE_WALLET_URL       = "http://wallet:4005"
    SERVICE_NOTIFICATION_URL = "http://notification:4006"
    SERVICE_BILLING_URL      = "http://billing:4007"
  }

  common_tags = {
    Environment = var.env
    Project     = var.project
    ManagedBy   = "Terraform"
  }
}