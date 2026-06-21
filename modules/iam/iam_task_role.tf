# ==================== (Optional) Common Task Role ====================
# Note: Per-service task roles are created inside the ecs-service module for least privilege.
# You can add a shared task role here if needed for common permissions.

resource "aws_iam_role" "task_role_common" {
  name = "${var.env}-${var.project}-ecs-task-role-common"

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
    Name        = "${var.env}-${var.project}-ecs-task-role-common"
    Environment = var.env
  })
}

# ==================== Enhanced Common Policy (S3 + RDS + CloudWatch) ====================
resource "aws_iam_role_policy" "task_common" {
  name = "${var.env}-${var.project}-task-common"
  role = aws_iam_role.task_role_common.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # ==================== CloudWatch ====================
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams",
          "logs:CreateLogGroup",
          "cloudwatch:PutMetricData",
          "cloudwatch:GetMetricStatistics",
          "cloudwatch:ListMetrics"
        ]
        Resource = "*"
      },

      # ==================== S3 ====================
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [
          "arn:aws:s3:::${var.project}-*",
          "arn:aws:s3:::${var.project}-/"
        ]
      },

      # ==================== RDS ====================
      {
        Effect = "Allow"
        Action = [
          "rds:DescribeDBInstances",
          "rds:DescribeDBClusters",
          "rds-db:connect"               # For IAM Database Authentication
        ]
        Resource = "*"
      },

      # ==================== Additional useful permissions ====================
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeNetworkInterfaces",   # Sometimes needed by ECS
          "ssm:GetParametersByPath"          # For structured config
        ]
        Resource = "*"
      }
    ]
  })
}