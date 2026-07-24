resource "aws_security_group" "rds" {
  name        = "${var.env}-${var.project}-rds-sg"
  description = "Security group for RDS"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]   # Allow ECS to connect
    description     = "Allow ECS tasks to connect to RDS"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name        = "${var.env}-${var.project}-rds-sg"
    Environment = var.env
    ManagedBy   = "Terraform"
  })
}