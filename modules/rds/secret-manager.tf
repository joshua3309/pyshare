# Secrets Manager Secret (full DATABASE_URL)
resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.env}-${var.project}-db-credentials"
  description = "Database connection string for ${var.service_name}"

  tags = merge(var.tags, {
    Name        = "${var.env}-${var.project}-db-credentials"
    Environment = var.env
  })
}

resource "aws_secretsmanager_secret_version" "db_credentials_version" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    DATABASE_URL = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${var.db_name}?schema=private"
  })
}

resource "aws_secretsmanager_secret" "jwt_secrets" {
  name        = "${var.env}-${var.project}-jwt-secrets"
  description = "JWT secrets for authentication"

  tags = merge(var.tags, {
    Name        = "${var.env}-${var.project}-jwt-secrets"
    Environment = var.env
  })
}

resource "aws_secretsmanager_secret_version" "jwt_secrets_version" {
  secret_id = aws_secretsmanager_secret.jwt_secrets.id
  secret_string = jsonencode({
    JWT_ACCESS_SECRET   = random_password.jwt_access.result
    JWT_REFRESH_SECRET  = random_password.jwt_refresh.result
    JWT_SERVICE_SECRET  = random_password.jwt_service.result
    JWT_ACCESS_EXPIRY   = var.jwt_access_expiry
    JWT_REFRESH_EXPIRY  = var.jwt_refresh_expiry
  })
}

# Generate strong random secrets
resource "random_password" "jwt_access" {
  length           = 64
  special          = true
  override_special = "!@#$%^&*()_+-="
}

resource "random_password" "jwt_refresh" {
  length           = 64
  special          = true
  override_special = "!@#$%^&*()_+-="
}

resource "random_password" "jwt_service" {
  length           = 64
  special          = true
  override_special = "!@#$%^&*()_+-="
}
