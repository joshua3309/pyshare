# ==================================================
# ECS EC2 INSTANCE ROLE
# ==================================================

resource "aws_iam_role" "ecs_instance_role" {
  name = "${var.env}-${var.project}-ecs-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "sts:AssumeRole"

      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })

  tags = merge(var.tags, {
    Name        = "${var.env}-${var.project}-ecs-instance-role"
    Environment = var.env
  })
}

# ==================================================
# ECS AGENT POLICY
# ==================================================

resource "aws_iam_role_policy_attachment" "ecs_instance" {
  role       = aws_iam_role.ecs_instance_role.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

# ==================================================
# AWS SYSTEMS MANAGER (RECOMMENDED)
# ==================================================

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ecs_instance_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# ==================================================
# INSTANCE PROFILE
# ==================================================

resource "aws_iam_instance_profile" "ecs" {
  name = "${var.env}-${var.project}-ecs-instance-profile"

  role = aws_iam_role.ecs_instance_role.name
}