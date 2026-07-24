output "db_instance_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "db_credentials_secret_arn" {
  value = aws_secretsmanager_secret.db_credentials.arn
}

output "jwt_secrets_arn" {
  value = aws_secretsmanager_secret.jwt_secrets.arn
}

