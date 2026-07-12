# ─── PaySphere — AWS RDS PostgreSQL Configuration ────────────────────────
#
# Managed PostgreSQL database on AWS RDS.
# All microservices share this database (each with its own connection pool).
#
# Connection pool sizing:
#   - RDS db.t3.medium: max_connections ≈ 85
#   - 7 services × 10 connections each = 70 (within limit)
#   - For higher load: use RDS Proxy or upgrade to db.r5.large

resource "aws_db_subnet_group" "paysphere" {
  name        = "paysphere-db-subnet-group"
  description = "Private subnets for RDS"
  subnet_ids  = aws_subnet.private[*].id

  tags = { Name = "paysphere-db-subnet-group" }
}

resource "aws_security_group" "rds_sg" {
  name        = "paysphere-rds-sg"
  description = "Allow PostgreSQL access from ECS tasks only"
  vpc_id      = aws_vpc.paysphere.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "paysphere_db" {
  identifier             = "paysphere-db"
  engine                 = "postgres"
  engine_version         = "16.2"
  instance_class         = "db.t3.medium"
  allocated_storage      = 100
  max_allocated_storage  = 500
  storage_type           = "gp3"
  storage_encrypted      = true

  db_name  = "paysphere"
  username = "paysphere_admin"
  password = random_password.db_password.result

  db_subnet_group_name   = aws_db_subnet_group.paysphere.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  # High availability
  multi_az               = true
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  # Performance
  auto_minor_version_upgrade = true
  monitoring_interval        = 60  # Enhanced monitoring
  monitoring_role_arn        = aws_iam_role.rds_monitoring.arn

  # Security
  publicly_accessible = false
  deletion_protection = true

  tags = { Name = "paysphere-db" }
}

resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Store DB credentials in AWS Secrets Manager
resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "paysphere/db/credentials"
  description = "PaySphere RDS database credentials"

  recovery_window_in_days = 30
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id

  secret_string = jsonencode({
    username = aws_db_instance.paysphere_db.username
    password = random_password.db_password.result
    engine   = "postgres"
    host     = aws_db_instance.paysphere_db.address
    port     = 5432
    dbname   = "paysphere"
  })
}

# ─── RDS Proxy (optional — for connection pooling at scale) ──────────────
# Use this when you have many ECS tasks each opening connections.
# The proxy pools and shares connections to the database.

resource "aws_db_proxy" "paysphere_proxy" {
  name                   = "paysphere-db-proxy"
  debug_logging          = false
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = true
  role_arn               = aws_iam_role.db_proxy.arn
  vpc_subnet_ids         = aws_subnet.private[*].id
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  target_role_arn = aws_iam_role.db_proxy.arn

  auth {
    auth_scheme = "SECRETS"
    description = "RDS proxy auth"
    iam_auth    = "DISABLED"
    secret_arn  = aws_secretsmanager_secret.db_credentials.arn
  }

  tags = { Name = "paysphere-db-proxy" }
}
