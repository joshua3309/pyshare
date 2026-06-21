
# ==================== ECS Execution Role (Shared) ====================
resource "aws_iam_role" "execution_role" {
  name = "${var.env}-${var.project}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  tags = merge(var.tags, {
    Name        = "${var.env}-${var.project}-ecs-execution-role"
    Environment = var.env
  })
}

# Attach AWS managed policy for ECS task execution (pull images, write logs, etc.)
resource "aws_iam_role_policy_attachment" "execution_policy" {
  role       = aws_iam_role.execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Optional: Extra permissions for Execution Role (e.g., access to Secrets Manager / SSM)
resource "aws_iam_role_policy" "execution_extra" {
  name = "${var.env}-${var.project}-execution-extra"
  role = aws_iam_role.execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "ssm:GetParameter",
          "ssm:GetParameters",
          "kms:Decrypt"
        ]
        Resource = "*"
      }
    ]
  })
}